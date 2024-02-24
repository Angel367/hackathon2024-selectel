function ReadyToDonateItem({ name, svg, ready }) {
  return (
    <div className={`readyToDonateItem ${ready ? "ready" : ""}`}>
      <img src={svg} />
      <div className="readyToDonateItem__name">{name}</div>
    </div>
  );
}

export default ReadyToDonateItem;
