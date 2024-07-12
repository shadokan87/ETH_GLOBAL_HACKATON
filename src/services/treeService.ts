import tree from 'tree-cli';
import { config } from '../config';
import dirTree from 'directory-tree';

export interface treeReport {
  type: 'report',
  directories?: number,
  files?: number
}

export interface treeResult {
  name: string;
  type: 'file' | 'directory';
  contents?: treeResult[];
}

type listResult = Array<treeResult | treeReport>;

export class TreeService {
  constructor(private cwd: string = process.env.PWD!) { }

  setCwd(path: string): TreeService {
    this.cwd = path;
    return this;
  }

  async list(option: { report: boolean } = { report: false }) {
    const filteredTree = dirTree(this.cwd, { exclude: [/node_modules/] , attributes: ['type']} );
    console.log(JSON.stringify(filteredTree, null, 2));
    return filteredTree
  }
}