#!/Users/sam/.nvm/versions/node/v12.16.0/bin/ts-node



export const project = `/Users/sam/Dropbox/Spring_20/research_proj/CJS_Transform`
export const test_root:string =`${project}/test`
export const fixtures: string = `${test_root}/res/fixtures`;
export const test_dir: string = `${fixtures}/test_dir`;
export const EXPECTED = `${test_root}/res/expected`
export const ACTUAL = `${test_root}/res/actual`



export const JPP = (value: any): string => {
    return JSON.stringify(value, null, 3);
};

export enum FILE_TYPE {
    JS = ".js",
    JSON = '.json',
    OTHER = 'other',
    SYMLINK = "SYMLINK"
}

