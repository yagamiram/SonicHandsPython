import * as React from 'react';
import { connect } from 'react-redux';
import { Waveform } from '../Actions/actions';
import {WAVEFORMS} from '../Constants/Defaults';
import ToggleButton from './ToggleButton';
import StaticCanvas from './StaticCanvas';
import { IGlobalState } from '../Constants/GlobalState';
import {STYLE_CONST} from './Styles/styles';
import {WaveformStringType} from '../Constants/AppTypings';
var api = require('../Utils/api');
var simulateTheMouseEvents = require('../Utils/simulateMouseEvent');
interface IProps {
	buttonSize: number;
	dispatch?: Function;
	style?: any;
	waveform?: string;
	waveformChange(waveform: string): void;
}

interface IState {
	waveform: any;
}

function select(state: IGlobalState): any {
	return {
		waveform: state.Waveform.wave
	};
}

@connect(select)
class WaveformSelectGroup extends React.Component<IProps, IState> {

	constructor(props: IProps) {
		super(props);
		this.onButtonClick = this.onButtonClick.bind(this);
		this.draw = this.draw.bind(this);
	}

	public render(): React.ReactElement<{}> {
		return (
			<div style={this.props.style}>
				{WAVEFORMS.map((waveform: WaveformStringType, id: number) => {
					return (
						<ToggleButton
							id={waveform}
							isOn={waveform === this.props.waveform}
							onTouchStart={(e) => this.onButtonClick(e, waveform)}
							onClick={(e) => this.onButtonClick(e, waveform)}
							key={id}>
							<StaticCanvas
								height={this.props.buttonSize}
							    width={this.props.buttonSize}
							    draw={this.draw}
							    options={{waveform, active: this.props.waveform}}
							/>
						</ToggleButton>
					);
				})}
				Start the Theremin
			</div>
		);
	}

	public draw(ctx: CanvasRenderingContext2D, width: number, height: number, options: any) {
		const units = width/22;
		const cx = width/2;
		const cy = height/2;
		ctx.lineWidth = Math.floor(width/15);
		ctx.strokeStyle = this.props.waveform === options.waveform ? STYLE_CONST.GREEN : STYLE_CONST.BLACK;

		switch (options.waveform) {
			case 'sine':
				ctx.beginPath();
				ctx.moveTo(cx - (10*units), cy - (3*units));
				ctx.bezierCurveTo(cx + (5*units), cy - (14*units),cx - (5*units), cy + (14*units),cx + (10*units), cy + (3*units));
				ctx.stroke();
				break;
		}
	}


	private playMusic(eachSensorEvent) {
		console.log(eachSensorEvent);
	}

	private onButtonClick(e, waveform: string) {
	debugger;
	// Theory: When the start button is clicked, immediately make a call to the
	// api and get the value. Once the value you have got for clientX
	// if it is sensor2: choose a random value from 8 to 128
	// if it is sensor3: choose a random value from 128 to 256
	// if it is sensor4: choose a random value from 256 to 384
	// if it is sensor5: choose a random value from 384 to 512
	// if it is sensor6: choose a random value from 512 to 880
	// And for clientY
	// if it is sensorX: for less than 60 choose between 380 to 600 and for the rest choose between 80-380
	// If you are getting value constantly on any sensor then apply mousemove unless
	// all the sensors says "out of range"
		var outOfRangeCounter = 0
		var multiTouchArea = document.getElementById('touchArea')
		var isMouseEventDownTriggered = false
		var evt = new MouseEvent("mouseup", {
				 view: window,
				 bubbles: true,
				 cancelable: true,
				 clientX: 0,
				 clientY: 0
		 })
		 multiTouchArea.dispatchEvent(evt);
			api.fetchCoordinates().then(function (response) {
				console.log("the waveform selection response is", response);
				var results = response.data.values.map(function (key, value) { return key.value } )
				var parsedJson = results.map(function (key) { return JSON.parse(key); })
				parsedJson.map(function (sensorEvent) {
					console.log(sensorEvent);
					// pick each sensorEvent and check its Y coordinate
					if (outOfRangeCounter > 5) {
						// Trigger the mouse up event
						var evt = new MouseEvent("mouseup", {
								 view: window,
								 bubbles: true,
								 cancelable: true,
								 clientX: 80,
								 clientY: 80
						 })
						 multiTouchArea.dispatchEvent(evt);
						 outOfRangeCounter = 0;
					} else {
								if ('Sensor1' in sensorEvent && sensorEvent.Sensor1[1] != 'Out of range') {
									if (isMouseEventDownTriggered) {
										var evt = new MouseEvent("mousemove", {
												 view: window,
												 bubbles: true,
												 cancelable: true,
												 clientX: Math.floor(Math.random() * (8 - 0 + 1)) + 0,
												 clientY: (sensorEvent.Sensor1[1] <= 60 ?  Math.floor(Math.random() * (600 - 380 + 1)) + 380 : Math.floor(Math.random() * (380 - 80 + 1)) + 80)
										 })
										 multiTouchArea.dispatchEvent(evt);
									} else {
										// Trigger mouse move
										var evt = new MouseEvent("mousedown", {
												 view: window,
												 bubbles: true,
												 cancelable: true,
												 clientX: Math.floor(Math.random() * (8 - 0 + 1)) + 0,
												 clientY: (sensorEvent.Sensor1[1] <= 60 ?  Math.floor(Math.random() * (600 - 380 + 1)) + 380 : Math.floor(Math.random() * (380 - 80 + 1)) + 80)
										 })
										 multiTouchArea.dispatchEvent(evt);
										 isMouseEventDownTriggered = true;
									}
								} else if('Sensor2' in sensorEvent && sensorEvent.Sensor2[1] != 'Out of range') {
										if (isMouseEventDownTriggered) {
											// Trigger mouse move
											var evt = new MouseEvent("mousemove", {
													 view: window,
													 bubbles: true,
													 cancelable: true,
													 clientX: Math.floor(Math.random() * (128 - 8 + 1)) + 8,
													 clientY: (sensorEvent.Sensor2[1] <= 60 ?  Math.floor(Math.random() * (600 - 380 + 1)) + 380 : Math.floor(Math.random() * (380 - 80 + 1)) + 80)
											 })
											 multiTouchArea.dispatchEvent(evt);
										} else {
											// Trigger mouse move
											var evt = new MouseEvent("mousedown", {
													 view: window,
													 bubbles: true,
													 cancelable: true,
													 clientX: Math.floor(Math.random() * (128 - 8 + 1)) + 8,
													 clientY: (sensorEvent.Sensor2[1] <= 60 ?  Math.floor(Math.random() * (600 - 380 + 1)) + 380 : Math.floor(Math.random() * (380 - 80 + 1)) + 80)
											 })
											 multiTouchArea.dispatchEvent(evt);
											 isMouseEventDownTriggered = true;
										}
								} else if('Sensor3' in sensorEvent && sensorEvent.Sensor3[1] != 'Out of range') {
										if (isMouseEventDownTriggered) {
											// Trigger mouse move
											var evt = new MouseEvent("mousemove", {
													 view: window,
													 bubbles: true,
													 cancelable: true,
													 clientX: Math.floor(Math.random() * (256 - 128 + 1)) + 128,
													 clientY: (sensorEvent.Sensor3[1] <= 60 ?  Math.floor(Math.random() * (600 - 380 + 1)) + 380 : Math.floor(Math.random() * (380 - 80 + 1)) + 80)
											 })
											 multiTouchArea.dispatchEvent(evt);
										} else {
											// Trigger mouse move
											var evt = new MouseEvent("mousedown", {
													 view: window,
													 bubbles: true,
													 cancelable: true,
													 clientX: Math.floor(Math.random() * (256 - 128 + 1)) + 128,
													 clientY: (sensorEvent.Sensor3[1] <= 60 ?  Math.floor(Math.random() * (600 - 380 + 1)) + 380 : Math.floor(Math.random() * (380 - 80 + 1)) + 80)
											 })
											 multiTouchArea.dispatchEvent(evt);
											 isMouseEventDownTriggered = true;
										}
								} else if('Sensor4' in parsedJson && parsedJson.Sensor4[1] != 'Out of range') {
										if (isMouseEventDownTriggered) {
											// Trigger mouse move
											var evt = new MouseEvent("mousemove", {
													 view: window,
													 bubbles: true,
													 cancelable: true,
													 clientX: Math.floor(Math.random() * (384 - 256 + 1)) + 256,
													 clientY: (sensorEvent.Sensor4[1] <= 60 ?  Math.floor(Math.random() * (600 - 380 + 1)) + 380 : Math.floor(Math.random() * (380 - 80 + 1)) + 80)
											 })
											 multiTouchArea.dispatchEvent(evt);
										} else {
											// Trigger mouse move
											var evt = new MouseEvent("mousedown", {
													 view: window,
													 bubbles: true,
													 cancelable: true,
													 clientX: Math.floor(Math.random() * (384 - 256 + 1)) + 256,
													 clientY: (sensorEvent.Sensor4[1] <= 60 ?  Math.floor(Math.random() * (600 - 380 + 1)) + 380 : Math.floor(Math.random() * (380 - 80 + 1)) + 80)
											 })
											 multiTouchArea.dispatchEvent(evt);
											 isMouseEventDownTriggered = true;
										}
								} else if('Sensor5' in parsedJson && parsedJson.Sensor5[1] != 'Out of range') {
										if (isMouseEventDownTriggered) {
											// Trigger mouse move
											var evt = new MouseEvent("mousemove", {
													 view: window,
													 bubbles: true,
													 cancelable: true,
													 clientX: Math.floor(Math.random() * (512 - 384 + 1)) + 384,
													 clientY: (sensorEvent.Sensor5[1] <= 60 ?  Math.floor(Math.random() * (600 - 380 + 1)) + 380 : Math.floor(Math.random() * (380 - 80 + 1)) + 80)
											 })
											 multiTouchArea.dispatchEvent(evt);
										} else {
											// Trigger mouse move
											var evt = new MouseEvent("mousedown", {
													 view: window,
													 bubbles: true,
													 cancelable: true,
													 clientX: Math.floor(Math.random() * (512 - 384 + 1)) + 384,
													 clientY: (sensorEvent.Sensor5[1] <= 60 ?  Math.floor(Math.random() * (600 - 380 + 1)) + 380 : Math.floor(Math.random() * (380 - 80 + 1)) + 80)
											 })
											 multiTouchArea.dispatchEvent(evt);
											 isMouseEventDownTriggered = true;
										}
								} else if('Sensor6' in parsedJson && parsedJson.Sensor6[1] != 'Out of range') {
										if (isMouseEventDownTriggered) {
											// Trigger mouse move
											var evt = new MouseEvent("mousemove", {
													 view: window,
													 bubbles: true,
													 cancelable: true,
													 clientX: Math.floor(Math.random() * (880 - 512 + 1)) + 512,
													 clientY: (sensorEvent.Sensor6[1] <= 60 ?  Math.floor(Math.random() * (600 - 380 + 1)) + 380 : Math.floor(Math.random() * (380 - 80 + 1)) + 80)
											 })
											 multiTouchArea.dispatchEvent(evt);
										} else {
											// Trigger mouse move
											var evt = new MouseEvent("mousedown", {
													 view: window,
													 bubbles: true,
													 cancelable: true,
													 clientX: Math.floor(Math.random() * (880 - 512 + 1)) + 512,
													 clientY: 80,
											 })
											 multiTouchArea.dispatchEvent(evt);
											 isMouseEventDownTriggered = true;
											 var evt = new MouseEvent("mouseup", {
														view: window,
														bubbles: true,
														cancelable: true,
														clientX: Math.floor(Math.random() * (880 - 512 + 1)) + 512,
														clientY: 80,
												})
												multiTouchArea.dispatchEvent(evt);
										}
								}
					}

				 })
			})
		e.preventDefault();
		this.props.waveformChange(waveform);
		this.props.dispatch(Waveform(waveform));
	}
}
export default WaveformSelectGroup;
