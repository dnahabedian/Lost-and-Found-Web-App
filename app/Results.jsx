const React = require('react');
const TabList = require("./TabList");

const Results = function () {    
    const [isInit, setIsInit] = React.useState(false);
    const [list, setList] = React.useState([]);

    React.useEffect(()=>{
        if (!isInit){
            setIsInit(true);
            let params = new URLSearchParams(window.location.search);
            if (window.location.pathname.substring(1).includes("seeker")) {
                fetch("/getSeekerResults", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: window.sessionStorage.getItem("seekerResultsFilter")
                })
                .then(res=>res.json())
                .then(data=>{
                    setList(data);
                })
            } else {
                fetch("/getFinderResults", {
                    method: "POST",
                    headers: {
                        "Content-TYpe": "application/json"
                    },
                    body: window.sessionStorage.getItem("finderResultsFilter")
                })
                .then(res=>res.json())
                .then(data=>{
                    setList(data);
                })
            }
             
        }
    });
    
    return (
        <TabList items={list}></TabList>
    );
    
}


module.exports = Results;
