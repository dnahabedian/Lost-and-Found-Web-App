const React = require('react');

const Tab = function (props) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const expandTab = () => {
    return (
      <div className="tab">
        <div className="title-tab-container">
            <div id="tab-title">{props.title}</div>
        </div>
        <div className="inner-tab-row-container">
          {props.photo !== "" ? <img src={"http://ecs162.org:3000/images/dnahabedian/" + props.photo} className="image"/> : <div/>}
          <div className="inner-tab-column-container">
            <div className="inner-tab-row-container">
              <div className="field">Category</div>
              <div id="category">{props.category}</div>
            </div>
            <div className="inner-tab-row-container">
              <div className="field">Location</div>
              <div id="location">{props.location}</div>
            </div>
            <div className="inner-tab-row-container">
              <div className="field">Date</div>
              <div id="date">{props.date + " " + props.time}</div>
            </div>
            <div className="inner-tab-row-container">
              <div id="comment">{props.comment}</div>
            </div>
          </div>
        </div>
        
        
        <div className="more-less-container">
          <div className="more-less-button" onClick={() => buttonClick()}>Less</div>
        </div>
      </div>
    );
  }

  const shrinkTab = () => {
    return (
      <div className="tab">
        <div className="title-tab-container">
            <div id="tab-title">{props.title}</div>
            <div className="more-less-button" onClick={() => buttonClick()}>More</div>
        </div>
      </div>
    );
  }

  const buttonClick = () => {
    if (isExpanded){
      setIsExpanded(false);
    } else {
      setIsExpanded(true);
    }
  }
  
  return (
    <div>
      {isExpanded ? expandTab() : shrinkTab()}
    </div>
  );
    
}


module.exports = Tab;
