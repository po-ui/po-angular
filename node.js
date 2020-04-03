const regex = new RegExp('@portinari/portinari-((storage)|(sync))', 'g');

const content = `
import { PoSyncModel } from '@portinari/portinari-sync';
import { PoStorageModel } from '@portinari/portinari-storage';

export class Lola {

}

`;

console.log(content.replace(regex, '@po-ui/ng-$1'));
