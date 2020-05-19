import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Button,
  View,
  processColor,
} from 'react-native';
import update from 'immutability-helper';

import {LineChart, Timw} from 'react-native-charts-wrapper';
const greenBlue = 'rgb(26, 182, 151)';
const petrel = 'rgb(59, 145, 153)';
class LineChartScreen extends React.Component {
  constructor() {
    super();

    this.state = {
      data: {},
      tempValues: [],
      marker: {
        enabled: true,
        digits: 2,
        backgroundTint: processColor('#f6f8fa'),
        markerColor: processColor('#F0C0FF8C'),
        textColor: processColor('black'),
      },
      xAxis: {
        granularityEnabled: true,
        granularity: 3,
      },
      // visibleRange: {x: {min: 2, max: 3}},
      // drawFilled: true,
      // fillColor: processColor('blue'),
      // fillAlpha: 60,
      drawValues: true,
      // drawFilled: true,

      drawFilled: true,
      fillGradient: {
        colors: [processColor(petrel), processColor(greenBlue)],
        positions: [0, 0.5],
        angle: 90,
        orientation: 'TOP_BOTTOM',
      },
      fillAlpha: 1000,
      maxVisibleValueCount: 1,
      valueTextColor: 'white',
      config: {
        drawCircles: false,
        drawCircleHole: false,
      },
    };
  }

  componentDidMount() {
    const getCycle = i => {
      const n = 3 * i;
      return [
        53,
        52,
        // {x: n, y: 0},
        // {x: 0.5 + n, y: 1},
        // {x: 0.2 + n, y: 51},
        // {x: 0.45 + n, y: 53},
        // {x: 0.55 + n, y: 53},
        // {x: 0.6 + n, y: 0},
        // {x: 1.0 + n, y: 0},
        // {x: 1.1 + n, y: -50},
        // {x: 1.3 + n, y: -47},
        // {x: 1.85 + n, y: -20},
        // {x: 2 + n, y: -13},
        // {x: 2.8 + n, y: -2},
        // {x: 2.9 + n, y: 0},
        // {x: 3.1 + n, y: 53},
      ];
    };
    this.interval = setInterval(() => {
      let val = [];
      if(this.state.tempValues.length === 30) {
        this.setState({tempValues: [...this.state.tempValues.slice(1), this.props.instantValue]})
      }
      else{
        this.setState({tempValues: [...this.state.tempValues, this.props.instantValue]})
      }
      // val.push(Math.floor(Math.random() * 60) + 9, Math.floor(Math.random() * 60) + 9, Math.floor(Math.random() * 60) + 9);
      console.log({val: this.state.tempValues, calc: this.state.tempValues.length});
      this.setState(
        update(this.state, {
          data: {
            $set: {
              dataSets: [
                {
                  values: this.state.tempValues,
                    // ...getCycle(0),
                    // ...getCycle(1),
                    // ...getCycle(2),
                    // ...getCycle(3),
                    // ...getCycle(4),
                    // {x: 3.1, y: 50},
                    // {x: 6, y: 0.77},
                    // {x: 7, y: 105},
                  // ],
                  label: `${this.props.name} ${this.props.unit}`,
                  config: {
                    // mode: "CUBIC_BEZIER",
                    drawValues: false,
                    lineWidth: 2,
                    drawCircles: false,
                    circleColor: processColor(petrel),
                    drawCircleHole: false,
                    // circleRadius: 5,
                    highlightColor: processColor('transparent'),
                    color: processColor(petrel),
                    drawFilled: true,
                    fillGradient: {
                      colors: [processColor(petrel), processColor(greenBlue)],
                      positions: [0, 0.5],
                      angle: 90,
                      orientation: 'BOTTOM_TOP',
                    },
                    fillAlpha: 1000,
                    valueTextSize: 15,
                  },
                },
              ],
            },
          },
        }),
      );
    }, 2000);

    // this.interval = setInterval(() => this.setState({ test: Date.now() }), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onPressLearnMore() {
    this.refs.chart.setDataAndLockIndex({
      dataSets: [
        {
          values: this.state.tempValues,
          label: 'A',
        },
      ],
    });
  }

  handleSelect(event) {
    let entry = event.nativeEvent;
    if (entry == null) {
      this.setState({...this.state, selectedEntry: null});
    } else {
      this.setState({...this.state, selectedEntry: JSON.stringify(entry)});
    }

    console.log(event.nativeEvent);
  }

  render() {
    return (
      <View style={{flex: 1}}>
        {/*<Button*/}
        {/*  onPress={this.onPressLearnMore.bind(this)}*/}
        {/*  title="Press to load more"*/}
        {/*/>*/}
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>{`${
          this.props.name
        }`}</Text>
        <View style={styles.container}>
          <LineChart
            style={styles.chart}
            data={this.state.data}
            chartDescription={{text: ''}}
            legend={this.state.legend}
            marker={this.state.marker}
            xAxis={this.state.xAxis}
            drawGridBackground={false}
            borderColor={processColor('#f6f8fa')}
            borderWidth={1}
            drawBorders={true}
            autoScaleMinMaxEnabled={false}
            touchEnabled={true}
            dragEnabled={true}
            scaleEnabled={true}
            scaleXEnabled={true}
            scaleYEnabled={true}
            pinchZoom={true}
            doubleTapToZoomEnabled={true}
            highlightPerTapEnabled={true}
            highlightPerDragEnabled={false}
            // visibleRange={this.state.visibleRange}
            dragDecelerationEnabled={true}
            dragDecelerationFrictionCoef={0.99}
            ref="chart"
            keepPositionOnRotation={false}
            onSelect={this.handleSelect.bind(this)}
            // highlights={[]}
            drawValues={true}
            maxVisibleValueCount={0}
            drawFilled={true}
            fillColor={'blue'}
            onChange={event => console.log(event.nativeEvent)}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#f6f8fa',
  },
  chart: {
    flex: 1,
  },
});

export default LineChartScreen;
