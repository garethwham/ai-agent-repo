import React from 'react';
import { Timeline, TimelineItem }  from 'vertical-timeline-component-for-react';

function TimelineView({ tasks }) {
  return (
    <Timeline lineColor={'#ddd'}>
      {tasks.map(task => (
        <TimelineItem
          key={task.id}
          dateText={`${task.createdDate} - ${task.shipDate}`}
          style={{ color: '#e86971' }}
        >
          <h3>{task.title}</h3>
          <p>{task.description}</p>
        </TimelineItem>
      ))}
    </Timeline>
  );
}

export default TimelineView;