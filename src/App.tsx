import { createRef, useState } from 'react';
import { SVGSaver } from 'svgsaver-reboot/src/index.ts';

import { BG_B64, INVISIBLE_FONT_B64, NORMAL_TITLE_FONT_B64 } from './assets/base64';

function App() {
  const [invisible, setInvisible] = useState('INVISIBLE');
  const [based, setBased] = useState('BASED ON THE COMIC BOOK BY');
  const [credits, setCredits] = useState('Robert Kirkman, Cory Walker, & Ryan Ottley');

  const svgRef = createRef<SVGSVGElement>();

  const setValue = (e: React.FormEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
    e.preventDefault();
    setter(e.currentTarget.value);
  }

  const onDownload = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const svg = svgRef.current;

    if (svg) {
      const saver = new SVGSaver(svg);
      saver.saveAsPNG('title');
    }
  }

  return (
    <div className='main'>
      <svg width="1600" height="900" viewBox="0 0 1600 900" className='title' ref={svgRef}>
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

        <image xlinkHref={BG_B64} width={1600} height={900} />
        <g>
          <path id="invisible-path" d="M 0 400 Q 800 300 1600 400" fillOpacity={0} />
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
          {based}
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
          {credits}
        </text>
      </svg>

      <div className="inputs">
        <input value={invisible} onInput={(e) => setValue(e, setInvisible)} />
        <input value={based} onInput={(e) => setValue(e, setBased)} />
        <input value={credits} onInput={(e) => setValue(e, setCredits)} />
        <button onClick={onDownload}>Download</button>
      </div>
    </div>
  )
}

export default App
