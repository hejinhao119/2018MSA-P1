import * as React from 'react';
import './App.css';
import * as $ from 'jquery';
// import {AppBar, IconButton, Toolbar, Typography} from '@material-ui/core/';
// import SearchBar from 'material-ui-search-bar';
import CircularProgress from '@material-ui/core/CircularProgress';

interface IState {
  movieTitles: any[]
  movieOverviews: any[]
  moviePosterPath: any[]
}

class App extends React.Component<any,any,IState> {
  constructor(props: any) {
    super(props);

    this.state = {
      a:0,
      movieTitles: [],
      movieOverviews: [],
      moviePosterPaths: []
    }
    this.performSearch('')
    this.searchChangeHandler = this.searchChangeHandler.bind(this)
    
  }
  ///////////////////////////////////////////////////////////////////////////////
  public performSearch(searchName: any) {
    console.log('Perform search using moviedb')
    const urlString = 'https://api.themoviedb.org/3/search/movie?api_key=c0e5df18362201b9b43ffceb1bb5d318&query=' + searchName
    
    $.ajax({
      url: urlString,
      success: (searchResults) => {
        console.log("Fetched data seccessfully")
        const results = searchResults.results

        const titleArray = new Array()
        const overviewArray = new Array()
        const posterPathwArray = new Array()

        results.forEach((movie: any) => {
          console.log(movie.title)
          titleArray.push(movie.title)
        })

        results.forEach((movie: any) => {
          overviewArray.push(movie.overview)
        })

        results.forEach((movie: any) => {
          posterPathwArray.push(movie.poster_path)
        })

        this.setState({
          movieTitles: titleArray,
          movieOverviews: overviewArray,
          moviePosterPaths: posterPathwArray
        })
      },
      error: (xhr, status, err) => {
        console.error('Fail to fetch data')
      }
    })
  }

  public createTable = (movieTitles: [], movieOverviews: [], moviePosterPaths: []) => {
    const table = []
    let uniqueKey=0
    let posterPathCount=0
    for (const moviePosterPath of moviePosterPaths){
      let overviewCount=0
      const fullPostersrc= 'https://image.tmdb.org/t/p/w370_and_h556_bestv2' + moviePosterPath
      for (const movieOverview of movieOverviews) {
        let titleCount=0
        for (const movieTitle of movieTitles) {
          if (overviewCount===titleCount&&posterPathCount===titleCount){
            table.push(
                <table key={uniqueKey} className='box'>
                  <tbody>
                    <tr>
                      <td>
                        <img alt='Movie Poster' src={fullPostersrc} style = {{width:'200px', paddingTop:10, paddingLeft:13}}/>
                      </td>
                      <td>
                        <h2>{movieTitle}</h2>
                        <p>{movieOverview}</p>
                      </td>
                    </tr>
                  </tbody>
                </table>)
          uniqueKey+=1}
        titleCount+=1}
      overviewCount+=1}
      posterPathCount+=1}
    return table
  }

  public searchChangeHandler(event: any){
    const boundObject = this
    console.log(event.target.value)
    const searchName = event.target.value
    boundObject.performSearch(searchName)
  }

  public render() {
    return (
      <div>
        <table className="title">
          <tbody>
            <tr>
              <td>
                <img alt='MSA Icon' width='70' src='bulb.jpg'/>
              </td>
              <td>
                Movie Searcher
              </td>
            </tr>
          </tbody>
        </table>

        {<input style={{ fontSize: 14, 
              display: 'block', 
              width: '100%', 
              paddingBottom: 10, 
              paddingTop: 10, 
              paddingLeft: 13 }} 
              onChange={this.searchChangeHandler}
              placeholder='Search movies, TV, more...'/>}

        <div className='box'>
        {this.createTable(this.state.movieTitles, this.state.movieOverviews, this.state.moviePosterPaths)}
        <CircularProgress thickness={5} />
        </div>
          
      </div>
    );
  }
}
export default App;