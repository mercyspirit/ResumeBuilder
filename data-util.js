var fs = require('fs');

function restoreOriginalData(filename) {
	fullname = 'orig-' + filename;
    fs.writeFileSync(filename, fs.readFileSync(fullname));
}

function loadData(filename) {
    return JSON.parse(fs.readFileSync(filename));
}

function saveResumeData(data, filename) {
	// poke.json stores the pokemon array under key "pokemon", 
	// so we are recreating the same structure with this object
	var obj = {
		resume: data
	};

	fs.writeFileSync(filename, JSON.stringify(obj));
}

module.exports = {
    restoreOriginalData: restoreOriginalData,
    loadData: loadData,
    saveResumeData: saveResumeData,
}
