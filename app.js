const { createApp } = Vue;

const BuilderApp = {
  data() {
    return {
      profile: {
        name: '',
        birthday: '',
        gender: '',
        totalPax: '',
        childrenPax: '',
        roomType: '',
        ccName: '',
        ccNumber: '',
        ccExp: '',
        ccCvc: ''
      },
      validationIssues: {},
      globalMsg: '',
      parkSpots: [],
      chosenSpots: [],
      isLoading: false,
      fetchIssue: '',
      showReport: false,
      roomOptions: [
        'No accommodation needed',
        'Forest View Hotel',
        'Totoro Family Inn',
        'Witch Valley Guesthouse',
        'Luxury Ghibli Resort'
      ]
    };
  },
  created() {
    this.retrieveSpots();
  },
  methods: {
    retrieveSpots() {
      this.isLoading = true;
      this.fetchIssue = '';
      
      // Using Promises instead of async/await
      fetch('ghibli_park.json')
        .then(response => {
          if (!response.ok) {
            throw new Error('Http error');
          }
          return response.json();
        })
        .then(jsonData => {
          this.parkSpots = jsonData;
        })
        .catch(error => {
          this.fetchIssue = 'Failed to load places. Please try again later.';
          console.log('Error pulling JSON:', error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    
    isSpotChosen(spotId) {
      return this.chosenSpots.filter(s => s.id === spotId).length > 0;
    },
    
    handleSpotSelection(spot) {
      if (this.isSpotChosen(spot.id)) {
        // Remove it
        this.chosenSpots = this.chosenSpots.filter(s => s.id !== spot.id);
      } else {
        // Add it
        this.chosenSpots = this.chosenSpots.concat(spot);
      }
    },
    
    verifyInputs() {
      let isOk = true;
      const issues = {};
      
      if (!this.profile.name.trim()) { issues.name = 'Full name is required.'; isOk = false; }
      if (!this.profile.birthday) { issues.birthday = 'Date of birth is required.'; isOk = false; }
      if (!this.profile.gender) { issues.gender = 'Gender is required.'; isOk = false; }
      
      if (this.chosenSpots.length === 0) {
        issues.spots = 'Please select at least one Ghibli Park place.';
        isOk = false;
      }
      
      if (!this.profile.totalPax || this.profile.totalPax < 1) {
        issues.totalPax = 'Total visitors must be at least 1.';
        isOk = false;
      }
      if (this.profile.childrenPax === '' || this.profile.childrenPax < 0) {
        issues.childrenPax = 'Number of children cannot be negative.';
        isOk = false;
      }
      if (parseInt(this.profile.childrenPax) > parseInt(this.profile.totalPax)) {
        issues.childrenPax = 'Children cannot exceed total visitors.';
        isOk = false;
      }
      
      if (!this.profile.roomType) { issues.roomType = 'Accommodation selection is required.'; isOk = false; }
      if (!this.profile.ccName.trim()) { issues.ccName = 'Name on card is required.'; isOk = false; }
      if (!this.profile.ccNumber.trim()) { issues.ccNumber = 'Card number is required.'; isOk = false; }
      if (!this.profile.ccExp) { issues.ccExp = 'Expiration date is required.'; isOk = false; }
      if (!this.profile.ccCvc.trim()) { issues.ccCvc = 'CVC is required.'; isOk = false; }
      
      this.validationIssues = issues;
      return isOk;
    },
    
    buildItinerary() {
      this.validationIssues = {};
      this.globalMsg = '';
      this.showReport = false;
      
      const passed = this.verifyInputs();
      
      if (!passed) {
        this.globalMsg = 'There are mandatory items pending to be filled. Please complete the required fields.';
      } else {
        this.showReport = true;
        setTimeout(() => {
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
          });
        }, 120);
      }
    }
  }
};

createApp(BuilderApp).mount('#tour-builder-root');