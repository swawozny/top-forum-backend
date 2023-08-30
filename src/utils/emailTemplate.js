exports.createEmailHtml = ({title, content}) => {
    return `
    <html>
        <h1>${title}</h1>
        <p>${content}</p>
    </html>`
};
