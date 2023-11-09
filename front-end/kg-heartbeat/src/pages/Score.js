import React, { useEffect, useState } from 'react';
import QualityBar from '../components/QualityBar';
import { base_url } from '../api';
import axios from 'axios';
import { get_analysis_date, score_to_series, score_series_multiple_kgs, initialize_score_map, recalculate_score} from '../utils';
import Form from 'react-bootstrap/Form';
import CalendarPopup from '../components/CalendatPopup';
import { find_target_analysis } from '../utils';
import parseISO from 'date-fns/parseISO';
import LineChart from '../components/LineChart';
import SolidGauge from '../components/SolidGauge';
import MaterialTable from '../components/MaterialTable';
import Slider from '../components/Slider';
import Button from 'react-bootstrap/Button';

const score = 'Score'

function Score( { selectedKGs, setSelectedKGs} ){
    const [scoreData, setScoreData] = useState(null);
    const [scoreChart, setScoreChart] = useState(null);
    const [toggleSwitch, setToggleSwitch] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [defaultDate, setDeafaultDate] = useState(null);
    const [availableDates, setAvailableDate] = useState(null);
    const [graphicToggle,setGraphicToggle] = useState(null);
    const [sliderAv,setSliderAv] = useState(1);
    const [sliderLic,setSliderLic] = useState(1);
    const [sliderInter,setSliderInter] = useState(1);
    const [sliderSec,setSliderSec] = useState(1);
    const [sliderPerf,setSliderPerf] = useState(1);
    const [sliderAcc,setSliderAcc] = useState(1);
    const [sliderCons,setSliderCons] = useState(1);
    const [sliderConci,setSliderConci] = useState(1);
    const [sliderRep,setSliderRep] = useState(1);
    const [sliderBeli,setSliderBeli] = useState(1);
    const [sliderVeri,setSliderVeri] = useState(1);
    const [sliderCurr,setSliderCurr] = useState(1);
    const [sliderVol,setSliderVol] = useState(1);
    const [sliderComp,setSliderComp] = useState(1);
    const [sliderAmount,setSliderAmount] = useState(1);
    const [sliderRepConc,setSliderRepConc] = useState(1);
    const [sliderRepCons,setSliderRepCons] = useState(1);
    const [sliderUnder,setSliderUnder] = useState(1);
    const [sliderInterp,setSliderInterp] = useState(1);
    const [sliderVers,setSliderVers] = useState(1);
    const [personalizeScoreButton,setPersScoreBtn] = useState(false);
    const [buttonLabel, setButtonLabel] = useState('Personalize score');
    const [buttonColor, setButtonColor] = useState('outline-primary');
    const [resetButton, setResetButton] = useState(null);
    const [score_weights, setScoreWeights] = useState(initialize_score_map());
    const [personalizedScoreData, setPersonalizedScoreData] = useState(null);
    const [personalizedScoreChart,setPersonalizedScoreChart] = useState(null);
    const [analysisSelected,setAnalysisSelected] = useState(null)

    useEffect(() => {
        async function fetchData() {
            try {
              if (selectedKGs.length === 1) {
                const response = await axios.get(`${base_url}score/score_data?id=${selectedKGs[0].id}`);
                setScoreData(response.data);
              }
              else if(selectedKGs.length > 1){
                let arrayIDs = selectedKGs.map((item) => item.id);
                arrayIDs = {
                  id : arrayIDs
                }
                const response = await axios.post(`${base_url}score/score_data`,arrayIDs);
                setScoreData(response.data);
              }
            } catch (error) {
              console.error('Error during the search', error);
            }
        }
        fetchData();
      }, [selectedKGs]);

    useEffect(() => {
        if(scoreData){
            setAvailableDate(get_analysis_date(scoreData)) //set the analysis date available
            if(selectedDate == null)
                setDeafaultDate(parseISO(scoreData[scoreData.length-1].analysis_date))
            if(selectedKGs.length === 1){
                setGraphicToggle(<Form.Check
                    type="switch"
                    id="custom-switch"
                    label='Switch to chage view'
                    checked={toggleSwitch}
                    onChange={() => setToggleSwitch(!toggleSwitch)}
                    />)
                if(!toggleSwitch){
                    const series = score_to_series(scoreData,selectedKGs,score,'totalScore','Quality score value',54);
                    setScoreChart(<LineChart chart_title={'Score'} series={series} sub_title={scoreData[0].kg_name} y_min={0} y_max={100}/>)
                } else {
                    let analysis_selected;
                    if(selectedDate == null || selectedDate === '1970-01-01')
                        analysis_selected = find_target_analysis(scoreData,scoreData[scoreData.length-1].analysis_date,selectedKGs);
                    else
                        analysis_selected = find_target_analysis(scoreData,selectedDate,selectedKGs); 
                    const series = score_to_series(analysis_selected,selectedKGs,score,'totalScore','Quality score value',54);
                    setScoreChart(<SolidGauge series={series[0].data[0][1]} key={selectedDate + 'score'} chart_title={'Score'}/>)
                }
            } else if(selectedKGs.length >= 1){
                setGraphicToggle(null);
                setToggleSwitch(true);
                let analysis_selected;
                if(selectedDate == null || selectedDate === '1970-01-01')
                    analysis_selected = find_target_analysis(scoreData,scoreData[scoreData.length-1].analysis_date,selectedKGs);
                else
                    analysis_selected = find_target_analysis(scoreData,selectedDate,selectedKGs);
                setAnalysisSelected(analysis_selected)
                const columns = [
                    {
                        accessorKey: 'kgname',
                        header: 'KG name',
                        size: 150,
                    },
                    {
                        accessorKey: 'score',
                        header: 'Score',
                        size: 5,
                    }
                ]
                const data = score_series_multiple_kgs(analysis_selected,selectedKGs,54);
                setScoreChart(<MaterialTable columns_value={columns} data_table={data} key={selectedDate + 'score'}/>)
            }
        }
        if(personalizedScoreData){
            if(selectedKGs.length === 1){
                if(!toggleSwitch){
                    const series = score_to_series(personalizedScoreData,selectedKGs,score,'totalScore','Personalized Score value',54);
                    setPersonalizedScoreChart(<LineChart chart_title={'Personalinze Score value'} series={series} sub_title={personalizedScoreData[0].kg_name} y_min={0} y_max={100}/>)
                }else{
                    const series = score_to_series(personalizedScoreData,selectedKGs,score,'totalScore','Personalized Score value',54);
                    console.log(series[0].data.length - 1)
                    setPersonalizedScoreChart(<SolidGauge series={series[0].data[series[0].data.length - 1][1]} key={selectedDate + 'score personalized'} chart_title={'Personalized score'}/>)
                }
            } else if(selectedKGs.length !== 1){
                const columns = [
                    {
                        accessorKey: 'kgname',
                        header: 'KG name',
                        size: 150,
                    },
                    {
                        accessorKey: 'score',
                        header: 'Personalized score',
                        size: 5,
                    }
                ]
                const data = score_series_multiple_kgs(personalizedScoreData,selectedKGs,54);
                setPersonalizedScoreChart(<MaterialTable columns_value={columns} data_table={data} key={selectedDate + 'score personalized'}/>)
            }
        }
    }, [scoreData, selectedKGs, toggleSwitch, selectedDate,personalizedScoreData]);

    const handleDateSelect = (date) => {
        const calendar_date = new Date(date)
        const year = calendar_date.getFullYear();
        const month = (calendar_date.getMonth() + 1).toString().padStart(2,'0');
        const day = calendar_date.getDate().toString().padStart(2,'0');
        const converted_date = `${year}-${month}-${day}`;
        setSelectedDate(converted_date);
    }

    const handleSliderChange = (new_value,id) => {
        
        switch(id){
            case 'av':
                setSliderAv(new_value);
                score_weights['availability'] = new_value  
                break;
            case 'lic':
                setSliderLic(new_value)
                score_weights['licensing'] = new_value
                break;
            case 'inter':
                setSliderInter(new_value)
                score_weights['interlinking'] = new_value
                break;
            case 'sec':
                setSliderSec(new_value)
                score_weights['security'] = new_value
                break;
            case 'perf':
                setSliderPerf(new_value);
                score_weights['preformance'] = new_value
                break;
            case 'acc':
                setSliderAcc(new_value);
                score_weights['accuracy'] = new_value
                break;
            case 'cons':
                setSliderCons(new_value);
                score_weights['consistency'] = new_value
                break;
            case 'conc':
                setSliderConci(new_value);
                score_weights['conciseness'] = new_value
                break;
            case 'rep':
                setSliderRep(new_value);
                score_weights['reputation'] = new_value
                break;
            case 'believ':
                setSliderBeli(new_value);
                score_weights['believability'] = new_value
                break;
            case 'veri':
                setSliderVeri(new_value);
                score_weights['verifiability'] = new_value
                break;
            case 'curr':
                setSliderCurr(new_value);
                score_weights['currency'] = new_value
                break;
            case 'vol':
                setSliderVol(new_value);
                score_weights['volatility'] = new_value
                break;
            case 'compl':
                setSliderComp(new_value);
                score_weights['completeness'] = new_value
                break;
            case 'amount':
                setSliderAmount(new_value);
                score_weights['amount'] = new_value
                break;
            case 'rep-conc':
                setSliderRepConc(new_value);
                score_weights['repConc'] = new_value
                break;
            case 'rep-cons':
                setSliderRepCons(new_value);
                score_weights['repCons'] = new_value
                break;
            case 'under':
                setSliderUnder(new_value);
                score_weights['underst'] = new_value
                break;
            case 'interp':
                setSliderInterp(new_value);
                score_weights['interpretability'] = new_value
                break;
            case 'vers':
                setSliderVers(new_value);
                score_weights['versatility'] = new_value
                break;
            default:
        }
        setPersonalizedScoreChart(null)
        if(selectedKGs.length === 1)
            setPersonalizedScoreData(recalculate_score(scoreData,selectedKGs,score_weights,54))
        else if(selectedKGs.length !== 1)
            setPersonalizedScoreData(recalculate_score(analysisSelected,selectedKGs,score_weights,54))
    }

    const handleClickBtn = (click) =>{
        if(personalizeScoreButton){
            setPersScoreBtn(false)
            if(buttonLabel !== 'Personalize score'){
                setButtonLabel('Personalize score');
                setButtonColor('outline-primary');
                setResetButton(null);
            }
        }
        else{
            setPersScoreBtn(true)
                if(buttonLabel !== 'Close'){
                    setButtonLabel('Close')
                    setButtonColor('outline-danger')
                    setResetButton(<Button className='mb-2' variant="outline-danger" onClick={handleResetBtn}>Reset weights</Button>)
                }
            }
    }

    const handleResetBtn = (click) =>{
        setSliderAv(1);
        setSliderLic(1);
        setSliderInter(1);
        setSliderSec(1);
        setSliderPerf(1);
        setSliderAcc(1);
        setSliderCons(1);
        setSliderRep(1);
        setSliderBeli(1);
        setSliderVeri(1);
        setSliderCurr(1);
        setSliderVol(1);
        setSliderComp(1);
        setSliderAmount(1);
        setSliderRepConc(1);
        setSliderRepCons(1);
        setSliderUnder(1);
        setSliderInterp(1);
        setSliderVers(1); 
        setPersonalizedScoreData(scoreData); 
    }

    return(
        <div>
            <div className='d-flex'>
                <QualityBar selectedKGs={selectedKGs} setSelectedKG={setSelectedKGs}/>
                    {scoreData && (
                        <div className='w-100 p-3'>
                            <Button className='mb-2' variant={buttonColor} onClick={handleClickBtn}>{buttonLabel}</Button>
                            {personalizeScoreButton ? (
                                <div className="container mt-2 mb-3">
                                    <div className="row">
                                        <div className="col-sm-4">
                                            <div >
                                                <Slider onSliderSet={handleSliderChange} default_value={sliderAv} label={'Availability'} id={'av'}/>
                                            </div>
                                            </div>
                                            <div className="col-sm-4">
                                                <div>
                                                    <Slider onSliderSet={handleSliderChange} default_value={sliderLic} label={'Licensing'} id={'lic'}/>
                                                </div>
                                            </div>
                                            <div className="col-sm-4">
                                                <div>
                                                    <Slider onSliderSet={handleSliderChange} default_value={sliderInter} label={'Interlinking'} id={'inter'}/>
                                                </div>
                                            </div>
                                            <div className="col-sm-4">
                                                <div>
                                                    <Slider onSliderSet={handleSliderChange} default_value={sliderSec} label={'Security'} id={'sec'}/>
                                                </div>
                                            </div>
                                            <div className="col-sm-4">
                                                <div>
                                                    <Slider onSliderSet={handleSliderChange} default_value={sliderPerf} label={'Performance'} id={'perf'}/>
                                                </div>
                                            </div>
                                            <div className="col-sm-4">
                                                <div>
                                                    <Slider onSliderSet={handleSliderChange} default_value={sliderAcc} label={'Accuracy'} id={'acc'}/>
                                                </div>
                                            </div>
                                            <div className="col-sm-4">
                                                <div>
                                                    <Slider onSliderSet={handleSliderChange} default_value={sliderCons} label={'Consistency'} id={'cons'}/>
                                                </div>
                                            </div>
                                            <div className="col-sm-4">
                                                <div>
                                                    <Slider onSliderSet={handleSliderChange} default_value={sliderConci} label={'Conciseness'} id={'conc'}/>
                                                </div>
                                            </div>
                                            <div className="col-sm-4">
                                                <div>
                                                    <Slider onSliderSet={handleSliderChange} default_value={sliderRep} label={'Reputation'} id={'rep'}/>
                                                </div>
                                            </div>
                                            <div className="col-sm-4">
                                                <div>
                                                    <Slider onSliderSet={handleSliderChange} default_value={sliderBeli} label={'Believability'} id={'believ'}/>
                                                </div>
                                            </div>
                                            <div className="col-sm-4">
                                                <div>
                                                    <Slider onSliderSet={handleSliderChange} default_value={sliderVeri} label={'Verifiability'} id={'veri'}/>
                                                </div>
                                            </div>
                                            <div className="col-sm-4">
                                                <div>
                                                    <Slider onSliderSet={handleSliderChange} default_value={sliderCurr} label={'Currency'} id={'curr'}/>
                                                </div>
                                            </div>
                                            <div className="col-sm-4">
                                                <div>
                                                    <Slider onSliderSet={handleSliderChange} default_value={sliderVol} label={'Volatility'} id={'vol'}/>
                                                </div>
                                            </div>
                                            <div className="col-sm-4">
                                                <div>
                                                    <Slider onSliderSet={handleSliderChange} default_value={sliderComp} label={'Completeness'} id={'compl'}/>
                                                </div>
                                            </div>
                                            <div className="col-sm-4">
                                                <div>
                                                    <Slider onSliderSet={handleSliderChange} default_value={sliderAmount} label={'Amount of data'} id={'amount'}/>
                                                </div>
                                            </div>
                                            <div className="col-sm-4">
                                                <div>
                                                    <Slider onSliderSet={handleSliderChange} default_value={sliderRepConc} label={'Representational conciseness'} id={'rep-conc'}/>
                                                </div>
                                            </div>
                                            <div className="col-sm-4">
                                                <div>
                                                    <Slider onSliderSet={handleSliderChange} default_value={sliderRepCons} label={'Representational consistency'} id={'rep-cons'}/>
                                                </div>
                                            </div>
                                            <div className="col-sm-4">
                                                <div>
                                                    <Slider onSliderSet={handleSliderChange} default_value={sliderUnder} label={'Understandability'} id={'under'}/>
                                                </div>
                                            </div>
                                            <div className="col-sm-4">
                                                <div>
                                                    <Slider onSliderSet={handleSliderChange} default_value={sliderInterp} label={'Interpretability'} id={'interp'}/>
                                                </div>
                                            </div>
                                            <div className="col-sm-4">
                                                <div>
                                                    <Slider onSliderSet={handleSliderChange} default_value={sliderVers} label={'Versatility'} id={'vers'}/>
                                                </div>
                                            </div>
                                            {resetButton}

                                        </div>
                                    </div>
                            ) : (
                                <div>
                                </div>    
                            )}
                            {graphicToggle}
                            {toggleSwitch ? (
                                <div>
                                    <CalendarPopup selectableDates={availableDates} onDateSelect={handleDateSelect} defaultDate={defaultDate}/>
                                </div>
                            ) : (
                                <div>
 
                                </div>
                            )}
                            {scoreChart}
                            {personalizedScoreChart}
                        </div>
                    )}
            </div>
        </div>
    )
}

export default Score;