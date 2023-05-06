import { Request } from 'express';

interface FileMapper {
  file: Express.Multer.File;
}

interface FilesMapper {
  files: Express.Multer.File[];
}

export const fileMapper = ({ file }: FileMapper, type : string) => {
  if(file){
    return `${type}/${file.filename}`
  }
  return ""
};


export const filesMapper = ({ files }: FilesMapper, type : string) => {
  var filenames =[]; 
  files.map((file) =>{
    filenames.push(`${type}/${file.filename}`)
  })
  return filenames
};
