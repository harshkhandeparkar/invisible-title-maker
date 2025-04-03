import { createRef, useState } from 'react';
import { SVGSaver } from 'svgsaver-reboot/src/index.ts';

import { BG_B64, FINE_SPLATTER_B64, INVISIBLE_FONT_B64, NORMAL_TITLE_FONT_B64, SPLATTER_B64, SPLATTER_B64_2 } from './assets/base64';
import { randomDisplacement } from './blood';

const THEME_MAP = {
  'Invisible': {
    bg: '#189ff9',
    text: '#fcec01'
  },
  'Invisible Dark': {
    bg: '#189ff9',
    text: 'black'
  },
  'Atom Eve': {
    bg: '#eb607a',
    text: '#f3cad2'
  },
  'Rex Splode': {
    bg: '#ba3e1c',
    text: '#ecf76f'
  },
  'Omni Man': {
    bg: '#e1ebed',
    text: '#ca4230'
  },
  'Oliver': {
    text: '#95b38e',
    bg: '#9a004f'
  },
  'Allen': {
    bg: '#3936ed',
    text: '#2bffe1'
  }
}

function App() {
  const [invisible, setInvisible] = useState('invisible');
  const [based, setBased] = useState('based on the comic book by');
  const [capitalizeBased, setCapitalizeBased] = useState(true);
  const [credits, setCredits] = useState('Robert Kirkman, Cory Walker, & Ryan Ottley');
  const [capitalizeCredits, setCapitalizeCredits] = useState(false);

  const [enableSplatter, setEnableSplatter] = useState(false);
  const [splatterOpacity, setSplatterOpacity] = useState(1);
  const [fineSplatterRotation, setFineSplatterRotation] = useState(-10 + Math.random() * 20);
  const [centralSplatterTranslate, setCentralSplatterTranslate] = useState(randomDisplacement(0, 200));
  const [centralSplatterTranslate2, setCentralSplatterTranslate2] = useState(randomDisplacement(0, 200));

  const [invisibleFontSize, setInvisibleFontSize] = useState(400);
  const [invisibleDistortion, setInvisibleDistortion] = useState(0.35);
  const [invisiblePosition, setInvisiblePosition] = useState(33);

  const [theme, setTheme] = useState<keyof typeof THEME_MAP>('Invisible');

  const onRegen = () => {
    setCentralSplatterTranslate(randomDisplacement(0, 300));
    setCentralSplatterTranslate2(randomDisplacement(150, 400));
    setFineSplatterRotation(-10 + Math.random() * 20);
  }

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
      <svg width="70%" viewBox="0 0 1600 900" className='title' ref={svgRef}>
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

        <g>
          <path id="invisible-path" d="M 0 400 Q 800 200 1600 400" fillOpacity={0} />
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
          {/* <textPath href="#invisible-path" textAnchor='middle'> */}
          {
            invisible.split('').map((char, i, arr) => {
              // Elliptical arc
              const b2 = (invisibleDistortion * invisibleFontSize) ** 2; // Ellipse minor radius
              const x2 = ((i / (arr.length - 1) - 0.5) * 2) ** 2;

              // Difference in font
              const y = Math.round(Math.sqrt((1 - x2) * b2));

              const fontSize = invisibleFontSize - y;

              return <tspan fontSize={fontSize} key={i}>{char}</tspan>
            })
          }
          {/* </textPath> */}
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


        <g id="splatters" opacity={splatterOpacity} fill="red" style={{ mixBlendMode: 'multiply', filter: 'url(#displacementFilter)' }} display={enableSplatter ? 'inherit' : 'none'}>
          <image xlinkHref={FINE_SPLATTER_B64} width="100%" fill='red' transform={`rotate(${fineSplatterRotation})`} style={{transformOrigin: 'center'}} />
          <image xlinkHref={SPLATTER_B64_2} width="100%" height="100%" x={centralSplatterTranslate2[0]} y={centralSplatterTranslate2[1]} />
          <image xlinkHref={SPLATTER_B64} width="100%" height="100%" x={centralSplatterTranslate[0]} y={centralSplatterTranslate[1]} />
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
                    const btnTheme = THEME_MAP[themeName as keyof typeof THEME_MAP];

                    return <button
                      key={i}
                      style={{
                        backgroundColor: btnTheme.bg,
                        color: btnTheme.text,
                      }}
                      className={`theme-select-btn ${theme === themeName ? 'selected' : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setTheme(themeName as keyof typeof THEME_MAP);
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

      <p>Made with sweat & <img src={SPLATTER_B64} height="18px" /> | <a href="https://github.com/harshkhandeparkar/invisible-title-maker">Github</a></p>
    </div>
  )
}

export default App
