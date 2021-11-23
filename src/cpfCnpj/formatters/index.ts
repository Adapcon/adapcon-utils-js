export const formatCnpj = (cnpj: string): string => {
  if (typeof cnpj !== 'string' || cnpj.length !== 14) return ''

  cnpj = cnpj.replace(/\D/g, '')
  cnpj = cnpj.replace(/^(\d{2})(\d)/, '$1.$2')
  cnpj = cnpj.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
  cnpj = cnpj.replace(/\.(\d{3})(\d)/, '.$1/$2')
  cnpj = cnpj.replace(/(\d{4})(\d)/, '$1-$2')
  return cnpj
}

export const formatCpf = (cpf: string): string => {
  if (typeof cpf !== 'string' || cpf.length !== 11) return ''

  cpf = cpf.replace(/\D/g, '');
  cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
  cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
  cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  return cpf;
}
