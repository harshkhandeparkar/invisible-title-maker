import { createRef, useState } from 'react';
import { SVGSaver } from 'svgsaver-reboot/src/index.ts';

import { BG_B64, FINE_SPLATTER_B64, INVISIBLE_FONT_B64, NORMAL_TITLE_FONT_B64, SPLATTER_B64, SPLATTER_B64_2 } from './assets/base64';
import { randomDisplacement } from './blood';

function App() {
  const [invisible, setInvisible] = useState('INVISIBLE');
  const [based, setBased] = useState('based on the comic book by');
  const [capitalizeBased, setCapitalizeBased] = useState(true);
  const [credits, setCredits] = useState('Robert Kirkman, Cory Walker, & Ryan Ottley');
  const [capitalizeCredits, setCapitalizeCredits] = useState(false);
  const [enableSplatter, setEnableSplatter] = useState(false);
  const [splatterOpacity, setSplatterOpacity] = useState(1);

  const [centralSplatterTranslate, setCentralSplatterTranslate] = useState(randomDisplacement(0, 200));
  const [centralSplatterTranslate2, setCentralSplatterTranslate2] = useState(randomDisplacement(0, 200));

  const onRegen = () => {
    setCentralSplatterTranslate(randomDisplacement(0, 300));
    setCentralSplatterTranslate2(randomDisplacement(150, 400));
  }

  const svgRef = createRef<SVGSVGElement>();

  const setValue = (
    e: React.FormEvent<HTMLInputElement>,
    setter: (value: string) => void
  ) => {
    e.preventDefault();
    setter(e.currentTarget.value);
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

          <filter id="turbulent-disp">
            <feTurbulence
              type="fractalNoise"
              stitchTiles="stitch"
              baseFrequency="0.05"
              numOctaves="2"
              result="turbulence" />
            <feDisplacementMap
              in2="turbulence"
              in="SourceGraphic"
              scale="30"
              xChannelSelector="R"
              yChannelSelector="G" />
          </filter>
        </defs>

        <image xlinkHref={BG_B64} width={1600} height={900} preserveAspectRatio="false" />
        <g>
          <path id="invisible-path" d="M 0 400 Q 800 200 1600 400" fillOpacity={0} />
        </g>
        <text
          x="50%"
          textAnchor='middle'
          dominantBaseline='middle'
          fill="#fcec01"
          fontFamily='Wood Block CG Regular'
          style={{ fontFamily: 'Wood Block CG Regular' }}
          fontSize={312}
        >
          <textPath href="#invisible-path" textAnchor='middle'>
            {invisible}
          </textPath>
        </text>
        <text
          x="50%"
          y="72%"
          textAnchor='middle'
          dominantBaseline='middle'
          fill="#fcec01"
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
          fill="#fcec01"
          fontFamily='Futura'
          fontSize={32}
        >
          {capitalizeCredits ? credits.toUpperCase() : credits}
        </text>


        <g id="splatters" opacity={splatterOpacity} fill="red" style={{ mixBlendMode: 'multiply', filter: 'url(#displacementFilter)' }} display={enableSplatter ? 'inherit' : 'none'}>
          <image xlinkHref={FINE_SPLATTER_B64} width="100%" fill='red' />
          <image xlinkHref={SPLATTER_B64_2} width="100%" height="100%" x={centralSplatterTranslate2[0]} y={centralSplatterTranslate2[1]} />
          <image xlinkHref={SPLATTER_B64} width="100%" height="100%" x={centralSplatterTranslate[0]} y={centralSplatterTranslate[1]} />
        </g>
      </svg>

      <div className="inputs">
        <input value={invisible} onInput={(e) => setValue(e, setInvisible)} />

        <div className="row">
          <input value={based} onInput={(e) => setValue(e, setBased)} />
          <label>Capitalize</label>
          <input type="checkbox" checked={capitalizeBased} onClick={
            () => setCapitalizeBased((current) => !current)
          } />
        </div>

        <div className="row">
          <input value={credits} onInput={(e) => setValue(e, setCredits)} />
          <label>Capitalize</label>
          <input type="checkbox" checked={capitalizeCredits} onClick={
            () => setCapitalizeCredits((current) => !current)
          } />
        </div>

        <div className="row">
          <label>Blood Splatter</label>
          <input type="checkbox" checked={enableSplatter} onClick={
            () => setEnableSplatter((current) => !current)
          } />

          <label>Splatter Opacity</label>
          <input style={{ width: '30%' }} type="range" min={0} max={1} step={0.02} value={splatterOpacity} onInput={(e) => setValue(e, (val) => setSplatterOpacity(parseFloat(val)))} />

          <button onClick={onRegen}>Regenerate Splatter</button>
        </div>

        <button onClick={onDownload} id="dl-btn">Download</button>
      </div>

      <p>Made with sweat & <img src={SPLATTER_B64} height="18px" /> | <a href="https://github.com/harshkhandeparkar/invisible-title-maker">Github</a></p>
    </div>
  )
}

export default App
