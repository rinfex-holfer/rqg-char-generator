import {RuneElementalTitle, RuneFormTitle, RunePowerTitle, RuneType} from "../../../gameEntities/gameEntitiesTypes";

export const SET_ELEMENTAL_RUNE_ACTION = 'SET_ELEMENTAL_RUNE_ACTION';
export const SET_FORM_RUNE_ACTION = 'SET_FORM_RUNE_ACTION';
export const SET_POWER_RUNE_ACTION = 'SET_POWER_RUNE_ACTION';
export const SET_PRIMARY_RUNE_TITLE_ACTION = 'SET_PRIMARY_RUNE_TITLE_ACTION';
export const SET_SECONDARY_RUNE_TITLE_ACTION = 'SET_SECONDARY_RUNE_TITLE_ACTION';
export const SET_TERTIARY_RUNE_TITLE_ACTION = 'SET_TERTIARY_RUNE_TITLE_ACTION';
export const SET_POWER_OR_FORM_RUNE_AFFINITY_TITLES_ACTION = 'SET_POWER_OR_FORM_RUNE_AFFINITY_TITLES_ACTION';

export const setElementalRune = (
    runeName: RuneElementalTitle,
    value: number
) => ({
    type: SET_ELEMENTAL_RUNE_ACTION,
    payload: {
        runeName,
        value
    }
});

export const setPowerRune = (
    runeName: RunePowerTitle,
    value: number
) => ({
    type: SET_POWER_RUNE_ACTION,
    payload: {
        runeName,
        value
    }
});

export const setFormRune = (
    runeName: RuneFormTitle,
    value: number
) => ({
    type: SET_FORM_RUNE_ACTION,
    payload: {
        runeName,
        value
    }
});

export const setPrimaryRuneTitle = (runeName: RuneElementalTitle) => ({
    type: SET_PRIMARY_RUNE_TITLE_ACTION,
    payload: runeName,
});

export const setSecondaryRuneTitle = (runeName: RuneElementalTitle) => ({
    type: SET_SECONDARY_RUNE_TITLE_ACTION,
    payload: runeName,
});

export const setTertiaryRuneTitle = (runeName: RuneElementalTitle) => ({
    type: SET_TERTIARY_RUNE_TITLE_ACTION,
    payload: runeName,
});

export const addPowerOrFromRunesAffinity = (runeNames: (RunePowerTitle | RuneFormTitle)[]) => ({
    type: SET_POWER_OR_FORM_RUNE_AFFINITY_TITLES_ACTION,
    payload: runeNames,
});