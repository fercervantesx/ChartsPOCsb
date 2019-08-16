import React, { Component, useState } from 'react'
import { render } from 'react-dom'
import './index.css'
import 'react-vis/dist/style.css'
import {
  XYPlot,
  FlexibleWidthXYPlot,
  XAxis,
  YAxis,
  ChartLabel,
  HorizontalGridLines,
  RadialChart,
  Hint,
  Crosshair,
  CustomSVGSeries,
  AreaSeries,
  MarkSeries,
} from 'react-vis'
import data from './data.json'
import weatherData from './weatherData.json'
import Cloudy from './icons/Cloudy'
import Thunder from "./icons/Thunder";
import Drizzle from "./icons/Drizzle";
import Rain from "./icons/Rain";
import Snow from "./icons/Snow";
import Atmosphere from "./icons/Atmosphere";
import Clear from "./icons/Clear";

const series = data.map((d, index) => {
  let weathers = weatherData.list.slice(0, 40);
  return {
    x: new Date(weathers[index].dt_txt).valueOf(),
    y: d.ep || 0,
    w: weathers[index].weather[0].main,
  }
})

const symbolSeries = series.map((s, i) => ({
  x: s.x,
  y: 8.5,
  customComponent: (row, positionInPixels) => {
    let cmp
    if (i % 4 === 0 && i < series.length - 1) {
      if (s.w === 'Thunderstorm') {
        cmp = <Thunder />
      }
      if (s.w === 'Drizzle') {
        cmp = <Drizzle />
      }
      if (s.w === 'Rain') {
        cmp = <Rain />
      }
      if (s.w === 'Snow') {
        cmp = <Snow />
      }
      if (s.w === 'Atmosphere') {
        cmp = <Atmosphere />
      }
      if (s.w === 'Clear') {
        cmp = <Clear />
      }
      if (s.w === 'Clouds') {
        cmp = <Cloudy />
      }
    }
    return cmp
  },
}))

const _onNearestX = setValues => (value, { index }) => {
  setValues([series[index]])
}

function Example(props) {
  const [values, setValues] = useState([])
  return (
    <FlexibleWidthXYPlot xType="ordinal" height={400} yDomain={[0, 9]}>
      <HorizontalGridLines />
      <XAxis
        tickTotal={3}
        tickFormat={(v, i) => {
          if (i % 4 === 0) {
            return `${new Date(parseInt(v)).getHours()}:${new Date(parseInt(v))
              .getMinutes()
              .toString()
              .padStart(2, '0')}`
          }
        }}
      />
      <YAxis tickValues={[0, 5, 9]} />
      <ChartLabel
        text="KWH"
        className="alt-y-label"
        includeMargin={false}
        xPercent={-0.02}
        yPercent={0.25}
        style={{
          transform: 'rotate(-90)',
          textAnchor: 'end',
        }}
      />
      <ChartLabel
        text="KWH"
        className="alt-y-label"
        includeMargin={false}
        xPercent={-0.02}
        yPercent={0.75}
        style={{
          transform: 'rotate(-90)',
          textAnchor: 'end',
        }}
      />
      <AreaSeries
        onNearestX={_onNearestX(setValues)}
        data={series}
        fill={'#FFE600'}
        opacity={0.5}
        style={{ stroke: '#FFE600', strokeWidth: 3 }}
      />
      <CustomSVGSeries data={symbolSeries} />
      <MarkSeries
        className="mark-series-example"
        size={[2]}
        stroke={'#FFE600'}
        fill={'#FFE600'}
        data={series}
      />
      <Crosshair values={values} className={'test-class-name'}>
        <div style={{ padding: 5, width: 150, background: 'black' }}>
          <div>Date: {values[0] && new Date(values[0].x).toDateString()}</div>
          <div>KWH: {values[0] && values[0].y}</div>
          <div>
            Weather:{' '}
            {values[0] && values[0].w
              ? values[0].w : 'Error'}
          </div>
        </div>
      </Crosshair>
    </FlexibleWidthXYPlot>
  )
}

class SimpleRadialChart extends Component {
  state = {
    value: false,
  }

  render() {
    const { value } = this.state
    return (
      <RadialChart
        className={'donut-chart-example'}
        innerRadius={100}
        radius={140}
        getAngle={d => d.theta}
        data={[
          { theta: 2, className: 'custom-class' },
          { theta: 6 },
          { theta: 2 },
          { theta: 3 },
          { theta: 1 },
        ]}
        onValueMouseOver={v => this.setState({ value: v })}
        onSeriesMouseOut={v => this.setState({ value: false })}
        width={300}
        height={300}
      >
        {value !== false && <Hint value={value} />}
      </RadialChart>
    )
  }
}

class App extends Component {
  constructor() {
    super()
    this.state = {
      name: 'React',
    }
  }

  render() {
    return (
      <React.Fragment>
        <Example />
      </React.Fragment>
    )
  }
}

render(<App />, document.getElementById('root'))
