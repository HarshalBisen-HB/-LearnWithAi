'use client';

import React from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import TurboNode from './TurboNode';

const nodeTypes = {
    turbo : TurboNode
} 

function RoadmapCanvas({initialNodes,initialEdges}:any) {
  

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlowProvider>
        <ReactFlow nodes={initialNodes} edges={initialEdges}
        nodeTypes={nodeTypes}
        >
          <Controls />
          <MiniMap />
          {/* @ts-ignore */}
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}

export default RoadmapCanvas;
