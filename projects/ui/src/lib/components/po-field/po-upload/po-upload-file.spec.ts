import { PoUploadFile } from './po-upload-file';

describe('PoUploadFile', () => {

  let poUploadFile: PoUploadFile;

  it('should create PoUploadFile', () => {
    const fakeFile = {
      lastModified: 1504558774471,
      lastModifiedDate: new Date(),
      name: 'Teste',
      size: 0,
      type: '',
      webkitRelativePath: ''
    };

    poUploadFile = new PoUploadFile(fakeFile);

    expect(poUploadFile).toBeDefined();
  });

  it('should create PoUploadFile without a raw file', () => {
    poUploadFile = new PoUploadFile(null);

    expect(poUploadFile.name).not.toBeDefined();
  });

  it('should create PoUploadFile without a extension', () => {
    const fakeFile = {
      lastModified: 1504558774471,
      lastModifiedDate: new Date(),
      name: '',
      size: 0,
      type: '',
      webkitRelativePath: ''
    };

    poUploadFile = new PoUploadFile(fakeFile);
    expect(poUploadFile.extension).toEqual('');
  });

});
