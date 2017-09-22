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

                    const transition = selection =>
                        selection
                            .style('opacity', 1)
                            .transition()
                            .duration(3000)
                            .style('opacity', 0)


                    let svg = d3.select('svg')
                                .append('g')
                                .attr('class', 'bubble')

                    let g = d3.selectAll('g')
                                .selectAll('circle')
                                .data(nested[i].values)
                                .enter()
                                .append('circle')

                    let circle = g
                                    .attr('id', d => d['game_id'])
                                    .attr('cx', d => extractCoordinates(d)['x_coordinate'] || '')
                                    .attr('cy', d => extractCoordinates(d)['y_coordinate'] || '')
                                    .attr('r', extractRadius)
                                    .style('fill', '#FC998E')
                                    .call(transition)

                    let text = g
                                .append('p').text('hi')


                    i++
                    plot()
                }
            }, 2500)
        }
         plot()
    }

    d3.tsv('world_cup_geo.tsv', plotPoints)
}



// let svg = d3.select('svg')
//     svg.append('g')
//         .attr('class', 'bubble')
//         .selectAll('circle')
//         .data(nested[i].values)
//         .enter()
//         .each(matches => {
//             d3.select('h2')
//                 .text(matches.home + ' ' + nested[i].key)
//         })
//
//     svg.append('circle')
//         .attr('id', d => d['game_id'])
//         .attr('cx', d => extractCoordinates(d)['x_coordinate'] || '')
//         .attr('cy', d => extractCoordinates(d)['y_coordinate'] || '')
//         .attr('r', extractRadius)
//         .style('fill', '#FC998E')
//         .style('opacity', 1)
//         .transition()
//         .duration(3000)
//         .style('opacity', 0)
//
//     svg.append('p')
//         .text('hiiiiiii')
//         .style('font-size', '20px')
