export default {
    3: ["sim/cockpit2/gauges/indicators/airspeed_kts_pilot"],
    4: [undefined, undefined, "sim/cockpit2/gauges/indicators/vvi_fpm_pilot"],
    19: ["sim/cockpit2/gauges/indicators/compass_heading_deg_mag"],
    67: ["sim_aircraft/parts/acf_gear_deploy"],
    97: ["sim/cockpit/radios/nav1_freq_hz", "sim/cockpit/radios/nav1_stdby_freq_hz", undefined, undefined, "sim/cockpit/radios/nav2_freq_hz", "sim/cockpit/radios/nav2_stdby_freq_hz"],
    101: ["sim/cockpit/radios/adf1_freq_hz", "sim/cockpit/radios/adf1_stdby_freq_hz", undefined, undefined, "sim/cockpit/radios/adf2_freq_hz", "sim/cockpit/radios/adf2_stdby_freq_hz"],
    102: [undefined, undefined, undefined, "sim/cockpit/radios/nav1_dme_distance_nm", "sim/cockpit/radios/nav2_dme_distance_nm"],
    104: [undefined, "sim/cockpit/radios/transponder code"],
    116: [undefined, "autopilot: noe med altitude"],
    117: [undefined, "autopilot: kanskje heading?"],
    118: [undefined, "sim/cockpit/autopilot/heading_mag", "sim/cockpit/autopilot/vertical_velocity", "sim/cockpit/autopilot/altitude"],
    20: [undefined /*lat*/, undefined /*lon*/, "sim/cockpit2/gauges/altitude_ft_pilot"]
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