
const ListCard = (template) => {
    return `    
    <div style="
      width: 500px; 
      height: 700px; 
      padding: 30px; 
      border-radius: 12px; 
      box-shadow: 0 2px 4px rgba(0,0,0,0.1); 
      background: ${template.gradient};
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      text-align: center;
      color: white;
    ">
      <h2 style="
        margin: 0; 
        font-size: 42px;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        letter-spacing: 1px;
      ">${template.title}</h2>
      <p style="
        font-size: 24px;
        margin: 15px 0;
        opacity: 0.9;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
      ">${template.subtitle}</p>
      <p style="
        font-size: 38px;
        margin-top: 30px;
        font-weight: bold;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
      ">
        ${template.metric}
        <span style="display: block; font-size: 28px;">${template.metricLabel}</span>
      </p>
    </div>
    `;
}

module.exports = ListCard;