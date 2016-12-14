export default {
    97: ["sim/cockpit/radios/nav1_freq_hz", "sim/cockpit/radios/nav1_stdby_freq_hz", undefined, undefined, "sim/cockpit/radios/nav2_freq_hz", "sim/cockpit/radios/nav2_stdby_freq_hz"],
    104: [undefined, "Sim/cockpit/radios/transponder code"]
}

function convertXplaneRadioFreqValue(xplaneRadioFreqValue) {
    return xplaneRadioFreqValue / 100;
}

function convertClientRadioFreqValue(clientRadioFreqValue) {
    return clientRadioFreqValue * 100;
}

export const Conversions = {
    "sim/cockpit/radios/nav1_freq_hz": {in: convertXplaneRadioFreqValue, out: convertClientRadioFreqValue},
    "sim/cockpit/radios/nav1_stdby_freq_hz": {in: convertXplaneRadioFreqValue, out: convertClientRadioFreqValue},
    "sim/cockpit/radios/nav2_freq_hz": {in: convertXplaneRadioFreqValue, out: convertClientRadioFreqValue},
    "sim/cockpit/radios/nav2_stdby_freq_hz": {in: convertXplaneRadioFreqValue, out: convertClientRadioFreqValue},
};

export const SpeechCommands = {
    "sim/cockpit/radios/nav1_stdby_freq_hz": ["set nav 1 to :frequency", "set navigation radio to :frequency", "navigation 1", "navigation radio 1"]
};