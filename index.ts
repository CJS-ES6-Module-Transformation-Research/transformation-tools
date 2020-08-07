
export const project = require('path').join(__dirname)



export const JPP = (value: any): string => {
    return JSON.stringify(value, null, 3);
};

export function print(val:any){
    console.log(val)
}

export enum FILE_TYPE {
    JS = ".js",
    JSON = '.json',
    OTHER = 'other',
    SYMLINK = "SYMLINK"
}

