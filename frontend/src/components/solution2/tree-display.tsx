import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { type TreeNode } from './types'; // Assuming 'types.ts' is in the same directory

// =================================================================================
// --- INTERFACES ---
// =================================================================================
export interface TreeVisualizationProps {
    tree: TreeNode | null;
    squirrelPosition: string | null;
    walnutsAtRoot: number;
    t: Function;
}

// =================================================================================
// --- TREE VISUALIZATION COMPONENT ---
// =================================================================================
export const TreeVisualization: React.FC<TreeVisualizationProps> = ({ tree, squirrelPosition, walnutsAtRoot, t }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const [dimensions, setDimensions] = useState({ width: 800, height: 800 }); // Increased height

    useEffect(() => {
        if (!tree) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const margin = { top: 80, right: 80, bottom: 80, left: 80 };
        const width = dimensions.width - margin.left - margin.right;
        const height = dimensions.height - margin.top - margin.bottom;

        const g = svg.append("g")
            .attr("transform", `translate(${margin.left + width / 2},${margin.top})`);

        // Create tree layout with more vertical spacing
        const treeLayout = d3.tree<TreeNode>()
            .size([width * 0.8, height * 0.9]) // Use more height space
            .separation((a: any, b: any) => (a.parent === b.parent ? 1.5 : 2));

        const root = d3.hierarchy(tree);
        const treeData = treeLayout(root);

        // Calculate the actual bounds of the tree
        let minX = Infinity, maxX = -Infinity;
        treeData.descendants().forEach((d: any) => {
            if (d.x < minX) minX = d.x;
            if (d.x > maxX) maxX = d.x;
        });

        // Center the tree horizontally
        const treeWidth = maxX - minX;
        const xOffset = -treeWidth / 2 - minX;

        // Flip y coordinates to put root at bottom and apply centering
        treeData.descendants().forEach((d: any) => {
            d.y = height - d.y;
            d.x = d.x + xOffset;
        });

        // Update SVG dimensions if tree is larger
        const requiredWidth = Math.max(800, treeWidth + margin.left + margin.right + 100);
        const requiredHeight = dimensions.height;
        
        svg.attr("width", requiredWidth)
           .attr("height", requiredHeight);

        // Create link generator for curved lines
        const linkGenerator = d3.linkVertical<any, any>()
            .x(d => d.x)
            .y(d => d.y);

        // Add gradient definitions
        const defs = svg.append("defs");
        
        const branchGradient = defs.append("linearGradient")
            .attr("id", "branchGradient")
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", "0%").attr("y1", "0%")
            .attr("x2", "0%").attr("y2", "100%");
        branchGradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "#A0826D");
        branchGradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "#8B6F47");

        // Draw links (branches)
        g.selectAll(".link")
            .data(treeData.links())
            .enter().append("path")
            .attr("class", "link")
            .attr("d", linkGenerator)
            .style("fill", "none")
            .style("stroke", "url(#branchGradient)")
            .style("stroke-width", (d: any) => {
                const depth = d.source.depth || 0;
                return Math.max(3, 8 - depth);
            })
            .style("opacity", 0.9);

        // Draw nodes
        const nodeGroups = g.selectAll(".node")
            .data(treeData.descendants())
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", (d: any) => `translate(${d.x},${d.y})`);

        // Add node circles
        nodeGroups.append("circle")
            .attr("r", (d: any) => d.data.id === 'A' ? 35 : 28)
            .style("fill", (d: any) => {
                const nodeData = d.data as TreeNode;
                if (nodeData.id === 'A') return "#8B4513";
                if (squirrelPosition === nodeData.uid) return "#FF6B6B";
                return "#22C55E";
            })
            .style("stroke", (d: any) => d.data.id === 'A' ? "#5D4037" : "#166534")
            .style("stroke-width", 3)
            .style("filter", "drop-shadow(0 3px 6px rgba(0,0,0,0.3))");

        // Add node labels
        nodeGroups.append("text")
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .style("fill", "white")
            .style("font-weight", "bold")
            .style("font-size", (d: any) => d.data.id === 'A' ? "20px" : "16px")
            .style("text-shadow", "1px 1px 2px rgba(0,0,0,0.5)")
            .text((d: any) => d.data.id);

        // Add walnut icons
        nodeGroups.each(function (d: any) {
            const nodeData = d.data as TreeNode;
            if (nodeData.id !== 'A' && nodeData.walnutsStored > 0) {
                const group = d3.select(this);
                const walnutGroup = group.append("g")
                    .attr("transform", "translate(0, 35)");

                for (let i = 0; i < nodeData.walnutsStored; i++) {
                    walnutGroup.append("image")
                        .attr("href", "/solution2/walnut.png")
                        .attr("x", (i - nodeData.walnutsStored / 2) * 15) // Center the walnuts
                        .attr("y", -10)
                        .attr("width", 15)
                        .attr("height", 15);
                }
            }
        });

        // Add squirrel image if present
        if (squirrelPosition) {
            const squirrelNode = treeData.descendants().find((d: any) => (d.data as TreeNode).uid === squirrelPosition);
            if (squirrelNode) {
                g.append("image")
                    .attr("href", "/solution2/squirrel.png")
                    .attr("x", squirrelNode.x - 20)
                    .attr("y", squirrelNode.y - 60)
                    .attr("width", 40)
                    .attr("height", 40)
                    .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.3))");
            }
        }

        // Add root walnut counter
        const rootNode = treeData.descendants().find((d: any) => d.data.id === 'A');
        if (rootNode) {
            g.append("rect")
                .attr("x", rootNode.x - 40)
                .attr("y", rootNode.y + 45)
                .attr("width", 80)
                .attr("height", 25)
                .attr("rx", 12)
                .style("fill", "rgba(255,255,255,0.9)")
                .style("stroke", "#8B4513")
                .style("stroke-width", 2);
            
           g.append("text")
    .attr("x", rootNode.x)
    .attr("y", rootNode.y + 62)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .style("font-weight", "bold")
    .style("fill", "#8B4513")
    .text(`${t('squirrel.collected')}: ${walnutsAtRoot}`);
        }

        // Scroll to center after rendering
        setTimeout(() => {
            if (containerRef.current) {
                const container = containerRef.current;
                const scrollLeft = (container.scrollWidth - container.clientWidth) / 2;
                container.scrollLeft = scrollLeft;
            }
        }, 100);

    }, [tree, squirrelPosition, walnutsAtRoot, dimensions, t]);

    return (
        <div className="panel viz-panel">
            <h3 className="section-header">{t('squirrel.display.title')}</h3>
            <div 
                ref={containerRef}
                className="tree-canvas" 
                style={{
                    background: 'linear-gradient(to bottom, #87CEEB 0%, #98FB98 100%)',
                    borderRadius: '8px',
                    padding: '20px',
                    overflow: 'auto',
                    maxHeight: '1000px',
                    position: 'relative'
                }}
            >
                {tree ? (
                    <svg ref={svgRef} style={{ display: 'block', margin: '0 auto' }} />
                ) : (
                    <div className="placeholder">{t('squirrel.display.placeholder')}</div>
                )}
            </div>
        </div>
    );
};