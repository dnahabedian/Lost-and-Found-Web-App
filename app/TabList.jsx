const React = require('react');
const Tab = require("./Tab");

const TabList = function ({ items }) {    
    
    return (
        <ul>
            {
                items.map(function(item, i) {
                return <Tab key={i} title={item.title} photo={item.photo} category={item.category} location={item.location} date={item.date} time={item.time} comment={item.comment}></Tab>;
                })
            }
        </ul>
    );
    
}


module.exports = TabList;
