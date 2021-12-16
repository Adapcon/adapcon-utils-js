export const bodyTemplate = (message: string, company: string): string => {
  return `
      <body style="background:#fff; padding:0 20px; color:#555; font-family: Arial, Helvetica, sans-serif; font-weight:200;">
        <h2>Olá.</h2>
        <div>${message}</div>
        <p>Qualquer dúvida estamos a disposição.</p>
        <p>Att.</p>
        ${company}
      </body>`
}
