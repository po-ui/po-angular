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

  describe('Methods:', () => {
    it('getFileSize: should return the size in kbytes', () => {
      poUploadFile = new PoUploadFile(null);

      let kbSize = poUploadFile['getFileSize'](3000);

      expect(kbSize).toEqual('3 KB');

      kbSize = poUploadFile['getFileSize'](0);

      expect(kbSize).toEqual('0 KB');
    });
  });
});
