const width = 928;
const height = 500;
const marginTop = 30;
const marginRight = 0;
const marginBottom = 30;
const marginLeft = 40;

const visualiseStudentButton = document.getElementById(
  "visualise-student-button"
);

function handleViewAssessments(assessments, classInfo) {
  addModal(
    `Performance for ${classInfo.name}`,
    `visualising-performance`,
    `<div id="graph-container"></div>`,
    () => {
      const data = assessments.map((assessment) => ({
        name: assessment.name,
        percentage: (assessment.score / assessment.total) * 100,
      }));

      const x = d3
        .scalePoint(data.map((d) => d.name))
        .domain(data.map((d) => d.name))
        .range([marginLeft, width - marginRight])
        .padding(0.1);

      const y = d3.scaleLinear(
        [0, d3.max(data, (d) => d.percentage)],
        [height - marginBottom, marginTop]
      );

      const line = d3
        .line()
        .x((d) => x(d.name))
        .y((d) => y(d.percentage));

      const svg = d3
        .create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

      svg
        .append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(
          d3
            .axisBottom(x)
            .ticks(width / 80)
            .tickSizeOuter(0)
        );

      // Add the y-axis, remove the domain line, add grid lines and a label.
      svg
        .append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(d3.axisLeft(y).ticks(height / 40))
        .call((g) => g.select(".domain").remove())
        .call((g) =>
          g
            .selectAll(".tick line")
            .clone()
            .attr("x2", width - marginLeft - marginRight)
            .attr("stroke-opacity", 0.1)
        )
        .call((g) =>
          g
            .append("text")
            .attr("x", -marginLeft)
            .attr("y", 10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text("% Score")
        );

      // Append a path for the line.
      svg
        .append("path")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", line(data));

      const container = document.getElementById("graph-container");
      container.append(svg.node());
    },
    null,
    true
  );
}
