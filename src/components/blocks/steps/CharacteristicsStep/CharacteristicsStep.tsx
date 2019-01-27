import * as React from "react";
import { connect } from 'react-redux';
import {GlobalState} from "../../../../store/storeTypes";
import {
    decrementFreeCharacteristicsPoints, incrementFreeCharacteristicsPoints, nextStep, prevStep,
    resetInitialCharacteristics, setCharacteristicsMode, setFreeCharacteristicsPoints,
    setStep
} from "../../../../store/stepsStore/stepsActions";
import {CharacteristicsMode, Step} from "../../../../store/stepsStore/stepsStoreTypes";
import {
    Characteristics, RuneElementalTitle, RuneFormTitle,
    RunePowerTitle
} from "../../../../gameEntities/gameEntitiesTypes";
import {getRunesList} from "../../../../gameEntities/gameEntities";
import {CharacteristicsStore} from "../../../../store/characterStore/characterStoreTypes";
import {setCharacteristics} from "../../../../store/characterStore/characterActions";
import {CharacteristicsCounter} from "./CharacteristicsCounter/CharacteristicsCounter";
import {rollD6} from "../../../../utils/diceRolls";
import {number} from "prop-types";
import {saveInitialCharacteristicsValues} from "../../../../store/stepsStore/stepsThunks";
import {MAX_FREE_CHARACTERISTICS_POINTS} from "../../../../store/stepsStore/stepsStore";
const CSS = require('./CharacteristicsStep.css');

interface CharacteristicsStepOwnProps {}

interface CharacteristicsStepPropsFromState {
    characteristics: CharacteristicsStore,
    freePoints: number,
    initialCharacteristics: CharacteristicsStore
    mode: CharacteristicsMode
}

interface CharacteristicsStepDispatchProps {
    setCharacteristics(characteristicsMap: CharacteristicsStore): void;
    saveInitialCharacteristicsValues(): void;
    resetInitialCharacteristics(): void;
    decrementFreeCharacteristicsPoints(): void;
    incrementFreeCharacteristicsPoints(): void;
    setFreeCharacteristicsPoints(value: number): void;
    setCharacteristicsMode(mode: CharacteristicsMode): void;
    nextStep(): void;
    prevStep(): void;
}

type CharacteristicsStepProps = CharacteristicsStepOwnProps & CharacteristicsStepPropsFromState & CharacteristicsStepDispatchProps;

const mapStateToProps = (state: GlobalState): CharacteristicsStepPropsFromState => ({
    characteristics: state.character.characteristics,
    freePoints: state.steps.characteristicsStep.freePoints,
    initialCharacteristics: state.steps.characteristicsStep.initialCharacteristics,
    mode: state.steps.characteristicsStep.mode,
});

const mapDispatchToProps = (dispatch): CharacteristicsStepDispatchProps => ({
    setCharacteristics: (characteristicsMap: CharacteristicsStore) =>
        dispatch(setCharacteristics(characteristicsMap)),
    saveInitialCharacteristicsValues: () => dispatch(saveInitialCharacteristicsValues()),
    resetInitialCharacteristics: () => dispatch(resetInitialCharacteristics()) ,
    decrementFreeCharacteristicsPoints: () => dispatch(decrementFreeCharacteristicsPoints()),
    incrementFreeCharacteristicsPoints: () => dispatch(incrementFreeCharacteristicsPoints()),
    setFreeCharacteristicsPoints: (value: number) => dispatch(setFreeCharacteristicsPoints(value)),
    setCharacteristicsMode: (mode: CharacteristicsMode) => dispatch(setCharacteristicsMode(mode)),
    nextStep: () => dispatch(nextStep()),
    prevStep: () => dispatch(prevStep()),
});

class CharacteristicsStepView extends React.PureComponent<CharacteristicsStepProps> {

    componentDidMount() {
        if (this.props.initialCharacteristics[Characteristics.SIZ] === null) {
            this.props.saveInitialCharacteristicsValues();
        }
    }

    undo = () => {
        this.reset();
        this.props.resetInitialCharacteristics();
        this.props.prevStep();
    }

    incrementChar(charKey: Characteristics) {
        this.props.setCharacteristics({[charKey]: this.props.characteristics[charKey] + 1});
        this.props.decrementFreeCharacteristicsPoints();
    }

    decrementChar(charKey: Characteristics) {
        this.props.setCharacteristics({[charKey]: this.props.characteristics[charKey] - 1});
        this.props.incrementFreeCharacteristicsPoints();
    }

    reset() {
        this.props.setCharacteristics(this.props.initialCharacteristics);
        this.props.setFreeCharacteristicsPoints(0);
    }

    // TODO move logic to thunk
    randomDistribution() {
        this.reset();
        const newCharRoll = {
            [Characteristics.STR]: rollD6(3),
            [Characteristics.SIZ]: rollD6(2) + 6,
            [Characteristics.DEX]: rollD6(3),
            [Characteristics.CON]: rollD6(3),
            [Characteristics.INT]: rollD6(2) + 6,
            [Characteristics.CHA]: rollD6(3),
            [Characteristics.POW]: rollD6(3),
        };
        const finalChars = Object.keys(newCharRoll).reduce((acc, charKey) => {
            acc[charKey] = this.props.initialCharacteristics[charKey] + newCharRoll[charKey];
            return acc;
        }, {});

        this.props.setCharacteristics(finalChars);

        const sum = Object.keys(newCharRoll).reduce((sum, charKey) => sum + newCharRoll[charKey], 0);
        if (sum <= 92) {
            this.props.setFreeCharacteristicsPoints(3);
        }
    }

    // TODO move logic to thunk
    fixedDistribution() {
        this.reset();
        this.props.setCharacteristicsMode(CharacteristicsMode.FIXED_NUMBER);
        this.props.setFreeCharacteristicsPoints(MAX_FREE_CHARACTERISTICS_POINTS);
    }

    render() {
        const nextStepReady =
            Object.keys(this.props.characteristics).every((charKey => this.props.characteristics[charKey] > 0))
            && this.props.freePoints === 0;

        return <div>
            <h4>Set characteristics:</h4>
            <button type={'button'} onClick={() => this.randomDistribution()}>Set random</button>
            <p>or</p>
            <button type={'button'} onClick={() => this.fixedDistribution()}>
                Distribute fixed points number
            </button>

            <div><b>Free points:</b> {this.props.freePoints}</div>

            <ul>
                {Object.keys(this.props.characteristics).map((charKey: Characteristics, index) => {
                    const value = this.props.characteristics[charKey];
                    const minValue = Math.max(1, 1 + this.props.initialCharacteristics[charKey]);
                    const maxValue = charKey === Characteristics.SIZ
                        ? 999
                        : Math.min(18 + this.props.initialCharacteristics[charKey], 21);

                    const canBeIncremented =
                        this.props.freePoints > 0 && value < maxValue;
                    const canBeDecremented =
                        this.props.mode !== CharacteristicsMode.RANDOM && value > minValue;

                    return <CharacteristicsCounter
                        key={index}
                        value={value}
                        title={charKey}
                        onIncrease={() => this.incrementChar(charKey)}
                        onReduce={() => this.decrementChar(charKey)}
                        canBeIncremented={canBeIncremented}
                        canBeDecremented={canBeDecremented}
                    />
                })}
            </ul>

            <button type={'button'} onClick={this.undo}>undo</button>
            <button
                type={'button'}
                disabled={!nextStepReady}
                className={!nextStepReady ? CSS.unactive : ''}
                onClick={this.props.nextStep}>next</button>
        </div>;
    }
}

export const CharacteristicsStep = connect(mapStateToProps, mapDispatchToProps)(CharacteristicsStepView);