import { createRef, useEffect, useState } from 'react';
import { SVGSaver } from 'svgsaver-reboot/src/index.ts';

import { BG_B64, INVISIBLE_FONT_B64, NORMAL_TITLE_FONT_B64, SPLATTER_B64 } from './assets/base64';
import { BIG_SPLATTERS, BloodLevel, FINE_SPLATTERS, generateSplatterSettings, getDistortedFontSize, Theme, THEME_MAP } from './utils';

function App() {
  const [invisible, setInvisible] = useState('invisible');
  const [based, setBased] = useState('based on the comic book by');
  const [capitalizeBased, setCapitalizeBased] = useState(true);
  const [credits, setCredits] = useState('Robert Kirkman, Cory Walker, & Ryan Ottley');
  const [capitalizeCredits, setCapitalizeCredits] = useState(false);

  const [invisibleFontSize, setInvisibleFontSize] = useState(400);
  const [invisibleDistortion, setInvisibleDistortion] = useState(0.35);
  const [invisiblePosition, setInvisiblePosition] = useState(33);

  const [enableSplatter, setEnableSplatter] = useState(false);
  const [splatterOpacity, setSplatterOpacity] = useState(1);
  const [bloodLevel, setBloodLevel] = useState<BloodLevel>(3);
  const [splatterSettings, setSplatterSettings] = useState(generateSplatterSettings(bloodLevel));

  const [theme, setTheme] = useState<Theme>('Invisible');

  const onRegen = () => {
    setSplatterSettings(generateSplatterSettings(bloodLevel));
  }

  useEffect(() => {
    onRegen();
  }, [bloodLevel]);

  const svgRef = createRef<SVGSVGElement>();

  const setValue = <T extends string>(
    e: React.FormEvent<HTMLInputElement | HTMLSelectElement>,
    setter: (value: T) => void
  ) => {
    e.preventDefault();
    setter(e.currentTarget.value as T);
  }

  const onDownload = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const svg = svgRef.current;

    if (svg) {
      const initialWidth = svg.getAttribute('width') ?? '90%';
      svg.setAttribute('height', '900px');
      svg.setAttribute('width', '1600px');

      const saver = new SVGSaver(svg);
      saver.saveAsPNG('title');

      svg.removeAttribute('height');
      svg.setAttribute('width', initialWidth);
    }
  }

  return (
    <div className='main'>
      <svg width="60%" viewBox="0 0 1600 900" className='title' ref={svgRef}>
        <defs>
          <style type='text/css'>
            {`
              @font-face {
                font-family: 'Wood Block CG Regular';
                src: url("${INVISIBLE_FONT_B64}");
              }

              @font-face {
                font-family: 'Futura';
                src: url("${NORMAL_TITLE_FONT_B64}");
              }
              `}
          </style>
        </defs>
        <g>
          <rect x={0} y={0} width={1600} height={900} fill={THEME_MAP[theme].bg} />
          <image xlinkHref={BG_B64} width={1600} height={900} preserveAspectRatio="false" style={{ mixBlendMode: 'luminosity' }} opacity={0.5} />
        </g>

        <text
          x="50%"
          y={`${invisiblePosition}%`}
          textAnchor='middle'
          dominantBaseline='hanging'
          fill={THEME_MAP[theme].text}
          fontFamily='Wood Block CG Regular'
          style={{ fontFamily: 'Wood Block CG Regular' }}
        >
          {
            invisible.split('').map((char, i, arr) => {
              const fontSize = getDistortedFontSize(invisibleFontSize, invisibleDistortion, i, arr.length);

              return <tspan fontSize={fontSize} key={i}>{char}</tspan>
            })
          }
        </text>
        <text
          x="50%"
          y="72%"
          textAnchor='middle'
          dominantBaseline='middle'
          fill={THEME_MAP[theme].text}
          fontFamily='Futura'
          fontSize={24}
        >
          {capitalizeBased ? based.toUpperCase() : based}
        </text>
        <text
          x="50%"
          y="80%"
          textAnchor='middle'
          dominantBaseline='middle'
          fill={THEME_MAP[theme].text}
          fontFamily='Futura'
          fontSize={32}
        >
          {capitalizeCredits ? credits.toUpperCase() : credits}
        </text>

        <g
          id="splatters"
          opacity={splatterOpacity}
          fill="red"
          style={{ mixBlendMode: 'multiply' }}
          display={enableSplatter ? 'inherit' : 'none'}
        >
          {
            !splatterSettings.fullBlood && FINE_SPLATTERS.map((splatter_img, i) => {
              return i < splatterSettings.fineSplatterLevel ? <image
                key={i}
                xlinkHref={splatter_img}
                width="100%"
                fill='red'
                transform={`rotate(${splatterSettings.fineSplatterRotations[0]})`}
                style={{ transformOrigin: 'center' }}
              /> : null;
            })
          }

          {
            !splatterSettings.fullBlood && BIG_SPLATTERS.map((splatter_img, i) => {
              return i < splatterSettings.bigSplatLevel ? <image
                xlinkHref={splatter_img}
                width="100%"
                height="100%"
                x={splatterSettings.bigSplatDisplacements[i][0]}
                y={splatterSettings.bigSplatDisplacements[i][1]}
                transform={`scale(${splatterSettings.bigSplatScale})`}
                style={{ transformOrigin: 'center' }}
              /> : null;
            })
          }

          {
            splatterSettings.fullBlood && <rect
              fill='red'
              width={1600}
              height={900}
              x={0}
              y={0}
            />
          }
        </g>
      </svg>

      <div className="inputs">
        <div className="row">
          <div className="col" style={{ width: '60%' }}>
            <div className="row">
              <input value={invisible} onInput={(e) => setValue(e, setInvisible)} onFocus={(e) => e.target.select()} />
              <label>Capitalize</label>
              <input type="checkbox" checked={true} readOnly={true} disabled={true} />
            </div>

            <div className="row">
              <input value={based} onInput={(e) => setValue(e, setBased)} onFocus={(e) => e.target.select()} />
              <label>Capitalize</label>
              <input type="checkbox" checked={capitalizeBased} onChange={
                () => setCapitalizeBased((current) => !current)
              } />
            </div>

            <div className="row">
              <input value={credits} onInput={(e) => setValue(e, setCredits)} onFocus={(e) => e.target.select()} />
              <label>Capitalize</label>
              <input type="checkbox" checked={capitalizeCredits} onChange={
                () => setCapitalizeCredits((current) => !current)
              } />
            </div>
          </div>

          <div className="col" style={{ width: '40%' }}>
            <div className="row">
              <label>Title Font Size</label>
              <input style={{ width: '40%' }} type="range" min={100} max={500} step={5} value={invisibleFontSize} onInput={(e) => setValue(e, (val) => setInvisibleFontSize(parseFloat(val)))} />
            </div>

            <div className="row">
              <label>Title Distortion</label>
              <input style={{ width: '40%' }} type="range" min={0} max={1} step={0.01} value={invisibleDistortion} onInput={(e) => setValue(e, (val) => setInvisibleDistortion(parseFloat(val)))} />
            </div>

            <div className="row">
              <label>Title Position</label>
              <input style={{ width: '40%' }} type="range" min={0} max={100} step={1} value={invisiblePosition} onInput={(e) => setValue(e, (val) => setInvisiblePosition(parseInt(val)))} />
            </div>
          </div>
        </div>

        <hr style={{ width: '100%' }} />

        <div className="row">
          <div className="col" style={{ width: '40%' }}>
            <div className="row">
              <label>Blood Splatter</label>
              <input type="checkbox" checked={enableSplatter} onChange={
                () => setEnableSplatter((current) => !current)
              } />
            </div>

            <div className="row">
              <label>Blood Level</label>
              <input style={{ width: '50%' }} type="range" min={1} max={6} step={1} value={bloodLevel} onInput={(e) => setValue(e, (val) => setBloodLevel(parseInt(val) as BloodLevel))} />
            </div>

            <div className="row">
              <label>Splatter Opacity</label>
              <input style={{ width: '50%' }} type="range" min={0} max={1} step={0.02} value={splatterOpacity} onInput={(e) => setValue(e, (val) => setSplatterOpacity(parseFloat(val)))} />
            </div>

            <div className="row">
              <button onClick={onRegen} className="btn">Regenerate Splatter</button>
            </div>
          </div>

          <div className="col">
            <div className="row">
              <div className="col">
                <label>Color Theme</label>
              </div>

              <div className="col">
                <div className="theme-btn-grid">
                  {Object.keys(THEME_MAP).map((themeName, i) => {
                    const btnTheme = THEME_MAP[themeName as Theme];

                    return <button
                      key={i}
                      style={{
                        backgroundColor: btnTheme.bg,
                        color: btnTheme.text,
                      }}
                      className={`theme-select-btn ${theme === themeName ? 'selected' : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setTheme(themeName as Theme);
                      }}
                    >
                      {themeName}
                    </button>
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr style={{ width: '100%' }} />

        <div className="row">
          <button onClick={onDownload} className="btn">Download</button>
        </div>
      </div>

      <p>Made with sweat & <img src={SPLATTER_B64} height="18px" /> | <a href="https://github.com/harshkhandeparkar/invisible-title-maker">Github</a> | <a href="https://github.com/harshkhandeparkar/invisible-title-maker?tab=readme-ov-file#credits">Credits</a></p>
    </div>
  )
}

export default App
