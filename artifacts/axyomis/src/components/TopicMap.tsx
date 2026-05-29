import React, { useMemo } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

// @ts-ignore
const TopicMap: React.FC<{ messages: any[], onClose: () => void }> = ({ messages, onClose }) => {
  const { nodes, links } = useMemo(() => {
    const nodes = messages.map((msg, index) => ({
      id: index,
      name: msg.content.substring(0, 20),
      val: 1
    }));

    const links = messages.slice(1).map((msg, index) => ({
      source: index,
      target: index + 1
    }));

    return { nodes, links };
  }, [messages]);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000 }} onClick={onClose}>
      <div style={{ color: 'white', textAlign: 'center', paddingTop: '2rem' }}>
        <h1>Conversation Topic Map</h1>
        <p>(Click anywhere to close)</p>
      </div>
      <ForceGraph2D
        graphData={{ nodes, links }}
        nodeLabel="name"
        backgroundColor="rgba(0,0,0,0)"
        linkColor={() => 'rgba(255,255,255,0.2)'}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.name;
          const fontSize = 12 / globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          const textWidth = ctx.measureText(label).width;
          const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);

          ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
          ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);

          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = 'white';
          ctx.fillText(label, node.x, node.y);
        }}
      />
    </div>
  );
};

export default TopicMap;

/*
NOTE: You need to install the following packages to run this component:

npm install react-force-graph-2d @types/react-force-graph-2d

*/