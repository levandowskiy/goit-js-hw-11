import axios from 'axios';

export default class NewsApiService {
    constructor(){
        this.loadedImages = 0;
        this.searchQuery = '';
        this.page = 1;
        this.API_KEY = '36079636-80c18f2b7171bd6af90a09a2e';
        this.BASE_URL = 'https://pixabay.com/api/';
    }
 
    async fetchCountries() {  
        const response = await axios.get(`${this.BASE_URL}`, {
            params: {
              key: this.API_KEY,
              q: this.searchQuery,
              image_type: 'photo',
              orientation: 'horizontal',
              safesearch: true,
              per_page: 40,
              page: this.page,
            },
          });
              
          this.page += 1;
          
          return response.data;
    }     
    
    reset() {
        this.page = 1;
        this.loadedImages = 0;
    }    
}



