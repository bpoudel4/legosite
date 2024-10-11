const setData = require("../data/setData");
const themeData = require("../data/themeData");

let sets = [];

function initialize() {
    return new Promise((resolve, reject) => {
        try {
            sets = setData.map(set => {
                const theme = themeData.find(theme => theme.id === set.theme_id)?.name || "Unknown";
                return { ...set, theme };
            });
            resolve();
        } catch (error) {
            reject("Failed to initialize sets data.");
        }
    });
}

function getAllSets() {
    return new Promise((resolve, reject) => {
        if (sets.length > 0) {
            resolve(sets);
        } else {
            reject("No sets available.");
        }
    });
}

function getSetByNum(setNum) {
    return new Promise((resolve, reject) => {
        const foundSet = sets.find(set => set.set_num === setNum);
        if (foundSet) {
            resolve(foundSet);
        } else {
            reject(`Set with number ${setNum} not found.`);
        }
    });
}

function getSetsByTheme(theme) {
    return new Promise((resolve, reject) => {
        const filteredSets = sets.filter(set => set.theme.toLowerCase().includes(theme.toLowerCase()));
        if (filteredSets.length > 0) {
            resolve(filteredSets);
        } else {
            reject(`No sets found for theme containing "${theme}".`);
        }
    });
}

module.exports = { initialize, getAllSets, getSetByNum, getSetsByTheme };

