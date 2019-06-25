[comment]: # (@label Migração do THF para o Portinari)
[comment]: # (@link guides/migration-thf-to-portinari)

Para facilitar a migração do seu projeto com o THF para o Portinari, disponibilizamos um pacote para fazer esta conversão. 

Este pacote, irá passar pelos arquivos do seu projeto alterando as palavras-chaves do THF para a nova nomenclatura do Portinari.

### Antes de iniciar a migração

Antes de iniciar a migração certifique-se que:
- Todos os arquivos estão salvos.
- As dependências do THF encontram-se na versão 4 ou superior.
- Se as pastas e os arquivos possuem permissão para terceiros alterá-los.

### Instalação do pacote de migração

Instale globalmente o pacote `po-migration` utilizando o npm, conforme o comando abaixo:

```
npm install -g po-migration
```

### Migrando o seu projeto

Após a instalação, navegue até a pasta do projeto que você deseja migrar para o Portinari.

Para iniciar a migração, execute o comando:

```
po-migration start
```

Este comando irá utilizar um dicionário de palavras-chaves do próprio THF para realizar a migração, ou seja, se tiver outra palavra que você criou e que não faz parte do THF, ele não irá alterar.

No entanto, caso você queira alterar até mesmo palavras criadas por você, utilize o seguinte comando:

```
po-migration start --all
```

Este comando atualiza todas as palavras do projeto que contém "thf, t-, ou totvs".

> Ao utilizar a opção `--all` certifique-se que não foi alterado nenhuma palavra que faça parte
do caminho de algum arquivo, que você possa ter colocado com o nome contendo algumas das palavras "thf, t-, ou totvs".

Veja a documentação completa do pacote `po-migration` executando o comando:

```
po-migration --help
```