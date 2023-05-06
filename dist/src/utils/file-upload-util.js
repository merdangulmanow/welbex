"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoFileFilter = exports.fileStorageFilter = exports.imageFileFilter = exports.editFileName = void 0;
const common_1 = require("@nestjs/common");
const path_1 = require("path");
const uuid_1 = require("uuid");
const editFileName = (req, file, callback) => {
    console.log('...........................', file.originalname.toLowerCase());
    callback(null, `${(0, uuid_1.v4)()}${(0, path_1.extname)(file.originalname.toLowerCase())}`);
};
exports.editFileName = editFileName;
const imageFileFilter = (req, file, callback) => {
    if (!Buffer.from(file.originalname.toLowerCase(), 'latin1').toString('utf8').match(/\.(jpg|jpeg|png|gif)$/)) {
        callback(new common_1.HttpException({ statusCode: 555, success: false, message: "invalid file type" }, common_1.HttpStatus.BAD_REQUEST));
    }
    callback(null, true);
};
exports.imageFileFilter = imageFileFilter;
const fileStorageFilter = (req, file, callback) => {
    if (!Buffer.from(file.originalname.toLowerCase(), 'latin1').toString('utf8').match(/\.(doc|docx|pdf|xlsx|xls|ppt|pptx|zip|rar|jpg|jpeg|png|gif)$/)) {
        callback(new common_1.HttpException({ statusCode: 555, success: false, message: "invalid file type" }, common_1.HttpStatus.BAD_REQUEST));
    }
    callback(null, true);
};
exports.fileStorageFilter = fileStorageFilter;
const videoFileFilter = (req, file, callback) => {
    if (!file.originalname.toLowerCase().match(/\.(mp4)$/)) {
        throw new common_1.HttpException('Only image files are allowed!', common_1.HttpStatus.INTERNAL_SERVER_ERROR), false;
    }
    callback(null, true);
};
exports.videoFileFilter = videoFileFilter;
//# sourceMappingURL=file-upload-util.js.map