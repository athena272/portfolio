import React from 'react';
import timeline from '../../data/timeline';
import TimelineItem from './TimelineItem';
import Title from './Title';
function Timeline() {
  return React.createElement("div", {
    className: "flex flex-col md:flex-row justify-center my-20"
  }, React.createElement("div", {
    className: "w-full md:w-7/12"
  }, React.createElement(Title, null, "Linha do Tempo"), timeline.map((item, index) => React.createElement(TimelineItem, {
    key: index,
    year: item.year,
    title: item.title,
    duration: item.duration,
    details: item.details
  }))));
}
export default Timeline;