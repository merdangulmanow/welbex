"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filesMapper = exports.fileMapper = void 0;
const fileMapper = ({ file }, type) => {
    if (file) {
        return `${type}/${file.filename}`;
    }
    return "";
};
exports.fileMapper = fileMapper;
const filesMapper = ({ files }, type) => {
    var filenames = [];
    files.map((file) => {
        filenames.push(`${type}/${file.filename}`);
    });
    return filenames;
};
exports.filesMapper = filesMapper;
//# sourceMappingURL=file-mapper.js.map