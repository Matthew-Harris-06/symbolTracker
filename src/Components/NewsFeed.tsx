import React from "react";
import { ListGroup } from "react-bootstrap";
import "./NewsFeed.css";
const NewsFeed = (props) => {
  return (
    <div id="newsDiv">
      
      <ListGroup>
      {props.newsArray.item && props.newsArray.item.slice(0,5).map((d) => {
        return (
          <ListGroup.Item variant="primary">
          <div className="descriptionDiv" key={d.id}>
            <a href={d.link}>{d.title}</a>
            <label>{d.pubDate.slice(0, d.pubDate.length - 14)}</label>
            <p>{d.description}</p>
          </div>
          </ListGroup.Item>
        );
      })}
      </ListGroup>
    </div>
  );
};

export default NewsFeed;
