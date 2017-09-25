let width = 1187
let height = 1080


const projection = d3.geoMercator()
                    .scale(190)
                    .translate([width/2, height/2])

const geoPath = d3.geoPath().projection(projection)


const draw = geo_data => {

    let svg = d3.select('body')
                .append('svg')
                .attr('width', width)
                .attr('height', height)
                .append('g')
                .attr('class', 'map')

    let map = svg.selectAll('path')
                .data(geo_data.features)
                .enter()
                .append('path')
                .attr('d', geoPath)
                .style('fill', '#99C1DC')
                .style('stroke', 'black')
                .style('stroke-width', '0.5')


    const extractCoordinates = game => {
        let projectedValue = projection([+game.long, +game.lat])
        return {
            x_coordinate: projectedValue[0],
            y_coordinate: projectedValue[1]
        }
    }


    const plotPoints = games => {

        let nested = d3.nest()
                        .key(d => d.year).sortKeys(d3.ascending)
                        .entries(games)

        let extractRadius = ({ attendance }) => {
            let maxAttendance = d3.max(games, game => game.attendance)
            let radius = d3.scaleSqrt(attendance)
                            .domain([0, maxAttendance])
                            .range([0, 1.5])

            return radius(attendance)
        }


        let i = 0

        const plot = () => {
            setTimeout(() => {

                if(i < nested.length){

                    const transition = (selection, setting) =>
                        selection
                            .style('opacity', 1)
                            .transition()
                            .duration(3000)
                            .style('opacity', 0)

                    let points = d3.select('svg')
                                .append('g')
                                .attr('class', 'points')
                                .selectAll('.points')
                                .data(nested[i].values)
                                .enter()

                    let title = points
                                .each(function(d,i) {
                                    if (i !== 0) return
                                    else {
                                        d3.select(this).append('text')
                                            .attr('class', 'tooltip')
                                            .attr('x', '50%')
                                            .attr('y', '20%')
                                            .attr('fill', '#F35F5F')
                                            .attr('text-anchor', 'middle')
                                            .text(d => d['home'] + ' ' + d['year'])
                                            .call(transition)
                                    }
                                })

                    let bubble = points
                                .append('g')
                                .attr('class', 'bubble')
                                .attr('id', d => d['game_id'])
                                .append('circle')

                    let circle = bubble
                                .attr('id', d => d['game_id'])
                                .attr('cx', d => extractCoordinates(d)['x_coordinate'] || '')
                                .attr('cy', d => extractCoordinates(d)['y_coordinate'] || '')
                                .attr('r', extractRadius)
                                .style('fill', '#FC998E')
                                .call(transition)

                    i++
                    plot()
                }
            }, 2500)
        }
         plot()
    }

    d3.tsv('world_cup_geo.tsv', plotPoints)
}
