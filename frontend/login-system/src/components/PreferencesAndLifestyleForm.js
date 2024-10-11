import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/PreferencesAndLifestyleForm.css';

const PreferencesAndLifestyleForm = () => {
  const [hobbies, setHobbies] = useState([]);
  const [dietaryPreference, setDietaryPreference] = useState('');
  const [religiousAffiliation, setReligiousAffiliation] = useState('');
  const [selectedHobbies, setSelectedHobbies] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [selectedMusicGenres, setSelectedMusicGenres] = useState([]);
  const [favoriteCuisine, setFavoriteCuisine] = useState('');
  const [sleepPreference, setSleepPreference] = useState('');
  const [petPreference, setPetPreference] = useState('');
  const [environmentalPractices, setEnvironmentalPractices] = useState('');
  const [responseMessage, setResponseMessage] = useState(''); // State to track backend response
  const [isLoading, setIsLoading] = useState(false); // State to track loading
  const navigate = useNavigate();
  const eID = sessionStorage.getItem('eID');

  useEffect(() => {
    const eID = sessionStorage.getItem('eID');
    const token = sessionStorage.getItem('userToken');
    if (!eID || !token) {
      navigate('/');
      return;
    }
  }, [navigate]);

  const handleSelectChange = (setState, value) => {
    setState([...value].map((option) => option.value)); // Extract values from selected options
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = {
      eID,
      hobbies,
      dietaryPreference,
      religiousAffiliation,
      selectedHobbies,
      selectedActivities,
      selectedMusicGenres,
      favoriteCuisine,
      sleepPreference,
      petPreference,
      environmentalPractices,
    };

    try {
      const response = await axios.post('https://login-9ebe.onrender.com/api/preferences', formData);
      setResponseMessage(`Success: ${response.data.message}`); // Display success message
    } catch (error) {
      setResponseMessage(`Error: ${error.response?.data?.message || 'Something went wrong!'}`); // Handle error message
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="preferences-lifestyle-form" onSubmit={handleSubmit}>
      <h2>Preferences and Lifestyle Information</h2>

      {/* Hobbies and Interests */}
      <div className="form-group">
        <label>Select Hobbies and Interests:</label>
        <select
          value={selectedHobbies}
          onChange={(e) => handleSelectChange(setSelectedHobbies, e.target.selectedOptions)}
        >
          <option value="Reading">Reading</option>
          <option value="Traveling">Traveling</option>
          <option value="Cooking">Cooking</option>
          <option value="Photography">Photography</option>
          <option value="Gardening">Gardening</option>
          <option value="Painting">Painting</option>
          <option value="Writing">Writing</option>
          <option value="Crafting">Crafting</option>
          <option value="Music">Music</option>
          <option value="Sports">Sports</option>
          <option value="Gaming">Gaming</option>
          <option value="Collecting">Collecting</option>
          <option value="Dancing">Dancing</option>
          <option value="Fishing">Fishing</option>
          <option value="Hiking">Hiking</option>
          <option value="Yoga">Yoga</option>
          <option value="Travel Photography">Travel Photography</option>
          <option value="Knitting">Knitting</option>
          <option value="Sculpting">Sculpting</option>
          <option value="Pottery">Pottery</option>
          <option value="Bird Watching">Bird Watching</option>
          <option value="Camping">Camping</option>
          <option value="DIY Projects">DIY Projects</option>
          <option value="Astronomy">Astronomy</option>
          <option value="Meditation">Meditation</option>
          <option value="Woodworking">Woodworking</option>
          <option value="Model Building">Model Building</option>
          <option value="Origami">Origami</option>
          <option value="Juggling">Juggling</option>
          <option value="Geocaching">Geocaching</option>
          <option value="Historical Reenactment">Historical Reenactment</option>
          <option value="Magic Tricks">Magic Tricks</option>
          <option value="Candle Making">Candle Making</option>
          <option value="Soap Making">Soap Making</option>
          <option value="Soap Carving">Soap Carving</option>
          <option value="Calligraphy">Calligraphy</option>
          <option value="Wine Tasting">Wine Tasting</option>
          <option value="Travel Writing">Travel Writing</option>
          <option value="Surfing">Surfing</option>
          <option value="Motorcycling">Motorcycling</option>
          <option value="Snowmobiling">Snowmobiling</option>
          <option value="Scuba Diving">Scuba Diving</option>
          <option value="Horseback Riding">Horseback Riding</option>
          <option value="Skydiving">Skydiving</option>
          <option value="Tattoo Art">Tattoo Art</option>
          <option value="Surfing">Surfing</option>
          <option value="Motorcycling">Motorcycling</option>
          <option value="Snowmobiling">Snowmobiling</option>
          <option value="Scuba Diving">Scuba Diving</option>
          <option value="Horseback Riding">Horseback Riding</option>
          <option value="Skydiving">Skydiving</option>
          <option value="Tattoo Art">Tattoo Art</option>
          <option value="Bowling">Bowling</option>
          <option value="Baking">Baking</option>
          <option value="Rock Climbing">Rock Climbing</option>
          <option value="Fishing">Fishing</option>
          <option value="Caving">Caving</option>
          <option value="Camping">Camping</option>
          <option value="Astrology">Astrology</option>
          <option value="Swimming">Swimming</option>
          <option value="Sailing">Sailing</option>
          <option value="Kayaking">Kayaking</option>
          <option value="Puzzles">Puzzles</option>
          <option value="Tattoo Design">Tattoo Design</option>
          <option value="Board Games">Board Games</option>
          <option value="Digital Art">Digital Art</option>
          <option value="Lego Building">Lego Building</option>
          <option value="Pet Training">Pet Training</option>
          <option value="Homebrewing">Homebrewing</option>
          <option value="Fencing">Fencing</option>
          <option value="Magic Tricks">Magic Tricks</option>
          <option value="Origami">Origami</option>
          <option value="Soap Making">Soap Making</option>
          <option value="Cycling">Cycling</option>
          <option value="Bungee Jumping">Bungee Jumping</option>
          <option value="Triathlons">Triathlons</option>
          <option value="Stand-Up Comedy">Stand-Up Comedy</option>
          <option value="Vlogging">Vlogging</option>
          <option value="Remote Control Cars">Remote Control Cars</option>
          <option value="Digital Photography">Digital Photography</option>
          <option value="Home Improvement">Home Improvement</option>
          <option value="Urban Exploration">Urban Exploration</option>
          <option value="Public Speaking">Public Speaking</option>
          <option value="Sculpture">Sculpture</option>
          <option value="Glassblowing">Glassblowing</option>
          <option value="Fishing">Fishing</option>
          <option value="Rock Balancing">Rock Balancing</option>
          <option value="Origami">Origami</option>
          <option value="Flower Arranging">Flower Arranging</option>
          <option value="Amateur Radio">Amateur Radio</option>
          <option value="Cycling">Cycling</option>
          <option value="Quilting">Quilting</option>
          <option value="Antique Collecting">Antique Collecting</option>
          <option value="Drones">Drones</option>
          <option value="Motor Racing">Motor Racing</option>
          <option value="Street Art">Street Art</option>
          <option value="Acrobatics">Acrobatics</option>
          <option value="Leatherworking">Leatherworking</option>
          <option value="Genealogy">Genealogy</option>

        </select>
      </div>

      {/* Favorite Activities */}
      <div className="form-group">
        <label>Select Favorite Activities:</label>
        <select
          value={selectedActivities}
          onChange={(e) => handleSelectChange(setSelectedActivities, e.target.selectedOptions)}
        >

        <option value="Running">Running</option>
        <option value="Swimming">Swimming</option>
        <option value="Gym">Gym</option>
        <option value="Cycling">Cycling</option>
        <option value="Hiking">Hiking</option>
        <option value="Rock Climbing">Rock Climbing</option>
        <option value="Dancing">Dancing</option>
        <option value="Yoga">Yoga</option>
        <option value="Meditation">Meditation</option>
        <option value="Team Sports">Team Sports</option>
        <option value="Individual Sports">Individual Sports</option>
        <option value="Martial Arts">Martial Arts</option>
        <option value="Pilates">Pilates</option>
        <option value="Skiing">Skiing</option>
        <option value="Snowboarding">Snowboarding</option>
        <option value="Surfing">Surfing</option>
        <option value="Kayaking">Kayaking</option>
        <option value="Canoeing">Canoeing</option>
        <option value="Horseback Riding">Horseback Riding</option>
        <option value="Fishing">Fishing</option>
        <option value="Boating">Boating</option>
        <option value="Snowshoeing">Snowshoeing</option>
        <option value="Crossfit">Crossfit</option>
        <option value="Obstacle Course Racing">Obstacle Course Racing</option>
        <option value="Triathlon">Triathlon</option>
        <option value="Ultimate Frisbee">Ultimate Frisbee</option>
        <option value="Archery">Archery</option>
        <option value="Inline Skating">Inline Skating</option>
        <option value="Bungee Jumping">Bungee Jumping</option>
        <option value="Paragliding">Paragliding</option>
        <option value="Motor Racing">Motor Racing</option>
        <option value="Sailing">Sailing</option>
        <option value="Zumba">Zumba</option>
        <option value="Aerobics">Aerobics</option>
        <option value="Tai Chi">Tai Chi</option>
        <option value="Skateboarding">Skateboarding</option>
        <option value="Ice Skating">Ice Skating</option>
        <option value="Speed Skating">Speed Skating</option>
        <option value="Surf Kayaking">Surf Kayaking</option>
        <option value="Snorkeling">Snorkeling</option>
        <option value="Windsurfing">Windsurfing</option>
        <option value="Jet Skiing">Jet Skiing</option>
        <option value="Mountain Biking">Mountain Biking</option>
        <option value="Ballet">Ballet</option>
        <option value="Modern Dance">Modern Dance</option>
        <option value="Swing Dancing">Swing Dancing</option>
        <option value="Hip-Hop Dance">Hip-Hop Dance</option>
        <option value="Breakdancing">Breakdancing</option>
        <option value="Fencing">Fencing</option>
        <option value="Judo">Judo</option>
        <option value="Taekwondo">Taekwondo</option>
        <option value="Kendo">Kendo</option>
        <option value="Aikido">Aikido</option>
        <option value="Boxing">Boxing</option>
        <option value="Kickboxing">Kickboxing</option>
        <option value="Capoeira">Capoeira</option>
        <option value="Wing Chun">Wing Chun</option>
        <option value="Krabi-Krabong">Krabi-Krabong</option>
        <option value="Mixed Martial Arts">Mixed Martial Arts</option>
        <option value="Krav Maga">Krav Maga</option>
        <option value="Parkour">Parkour</option>
        <option value="Slacklining">Slacklining</option>
        <option value="Caving">Caving</option>
        <option value="Rock Balancing">Rock Balancing</option>
        <option value="Geocaching">Geocaching</option>
        <option value="Bird Watching">Bird Watching</option>
        <option value="Wildlife Photography">Wildlife Photography</option>
        <option value="Astronomy">Astronomy</option>
        <option value="Stargazing">Stargazing</option>
        <option value="Home Brewing">Home Brewing</option>
        <option value="Wine Tasting">Wine Tasting</option>
        <option value="Beer Tasting">Beer Tasting</option>
        <option value="Distilling">Distilling</option>
        <option value="Mixology">Mixology</option>
        <option value="Cooking Classes">Cooking Classes</option>
        <option value="Baking Classes">Baking Classes</option>
        <option value="Cheese Making">Cheese Making</option>
        <option value="Preserving">Preserving</option>
        <option value="Charcuterie">Charcuterie</option>
        <option value="Fermentation">Fermentation</option>
        <option value="Sushi Making">Sushi Making</option>
        <option value="Cake Decorating">Cake Decorating</option>
        <option value="Bread Baking">Bread Baking</option>
        <option value="Candy Making">Candy Making</option>
        <option value="Gardening">Gardening</option>
        <option value="Floral Arranging">Floral Arranging</option>
        <option value="Landscape Design">Landscape Design</option>
        <option value="Organic Farming">Organic Farming</option>
        <option value="Urban Farming">Urban Farming</option>
        <option value="Aquaponics">Aquaponics</option>
        <option value="Hydroponics">Hydroponics</option>

        </select>
      </div>

      {/* Favorite Music Genres */}
      <div className="form-group">
        <label>Select Favorite Music Genres:</label>
        <select
          value={selectedMusicGenres}
          onChange={(e) => handleSelectChange(setSelectedMusicGenres, e.target.selectedOptions)}
        >

<option value="Pop">Pop</option>
          <option value="Rock">Rock</option>
          <option value="Hip-Hop">Hip-Hop</option>
          <option value="Classical">Classical</option>
          <option value="Jazz">Jazz</option>
          <option value="Electronic">Electronic</option>
          <option value="Country">Country</option>
          <option value="Reggae">Reggae</option>
          <option value="Blues">Blues</option>
          <option value="R&B">R&B</option>
          <option value="Metal">Metal</option>
          <option value="Folk">Folk</option>
          <option value="Soul">Soul</option>
          <option value="Alternative">Alternative</option>
          <option value="Latin">Latin</option>
          <option value="Ambient">Ambient</option>
          <option value="Punk">Punk</option>
          <option value="Gospel">Gospel</option>
          <option value="Funk">Funk</option>
          <option value="Dancehall">Dancehall</option>
          <option value="House">House</option>
          <option value="Techno">Techno</option>
          <option value="Trance">Trance</option>
          <option value="Dubstep">Dubstep</option>
          <option value="EDM">EDM</option>
          <option value="Industrial">Industrial</option>
          <option value="Synthwave">Synthwave</option>
          <option value="New Age">New Age</option>
          <option value="Opera">Opera</option>
          <option value="Country Blues">Country Blues</option>
          <option value="Bluegrass">Bluegrass</option>
          <option value="Indie">Indie</option>
          <option value="Garage Rock">Garage Rock</option>
          <option value="Ska">Ska</option>
          <option value="Latin Jazz">Latin Jazz</option>
          <option value="Neo-Soul">Neo-Soul</option>
          <option value="K-Pop">K-Pop</option>
          <option value="J-Pop">J-Pop</option>
          <option value="World Music">World Music</option>
          <option value="Chamber Music">Chamber Music</option>
          <option value="Celtic">Celtic</option>
          <option value="Traditional">Traditional</option>
          <option value="Soul Jazz">Soul Jazz</option>
          <option value="Swing">Swing</option>
          <option value="Big Band">Big Band</option>
          <option value="Bossa Nova">Bossa Nova</option>
          <option value="Flamenco">Flamenco</option>
          <option value="Glam Rock">Glam Rock</option>
          <option value="Ambient House">Ambient House</option>
          <option value="Lo-Fi">Lo-Fi</option>
          <option value="Synthpop">Synthpop</option>
          <option value="Grunge">Grunge</option>
          <option value="Post-Punk">Post-Punk</option>
          <option value="Trip-Hop">Trip-Hop</option>
          <option value="Drum and Bass">Drum and Bass</option>
          <option value="Downtempo">Downtempo</option>
          <option value="Garage">Garage</option>
          <option value="Deep House">Deep House</option>
          <option value="Electro">Electro</option>
          <option value="Post-Rock">Post-Rock</option>
          <option value="Ragga">Ragga</option>
          <option value="Jungle">Jungle</option>
          <option value="Acid Jazz">Acid Jazz</option>
          <option value="Psychedelic Rock">Psychedelic Rock</option>
          <option value="Experimental">Experimental</option>
          <option value="Hard Rock">Hard Rock</option>
          <option value="Alternative Rock">Alternative Rock</option>
          <option value="Noise Rock">Noise Rock</option>
          <option value="Experimental Rock">Experimental Rock</option>
          <option value="Acoustic">Acoustic</option>
          <option value="Baroque">Baroque</option>
          <option value="Renaissance">Renaissance</option>
          <option value="Romantic">Romantic</option>
          <option value="Contemporary Classical">Contemporary Classical</option>
          <option value="Electronicore">Electronicore</option>
          <option value="Trap">Trap</option>
          <option value="Dub">Dub</option>
          <option value="Breakbeat">Breakbeat</option>
          <option value="Lo-Fi Hip-Hop">Lo-Fi Hip-Hop</option>
          <option value="Post-Hardcore">Post-Hardcore</option>
          <option value="Screamo">Screamo</option>
          <option value="Death Metal">Death Metal</option>
          <option value="Black Metal">Black Metal</option>
          <option value="Doom Metal">Doom Metal</option>
          <option value="Thrash Metal">Thrash Metal</option>

        </select>
      </div>

      {/* Dietary Preferences */}
      <div className="form-group">
        <label>Dietary Preferences:</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              value="Vegetarian"
              checked={dietaryPreference === 'Vegetarian'}
              onChange={(e) => setDietaryPreference(e.target.value)}
            />
            Vegetarian
          </label>
          <label>
            <input
              type="radio"
              value="Vegan"
              checked={dietaryPreference === 'Vegan'}
              onChange={(e) => setDietaryPreference(e.target.value)}
            />
            Vegan
          </label>
          <label>
            <input
              type="radio"
              value="Gluten-Free"
              checked={dietaryPreference === 'Gluten-Free'}
              onChange={(e) => setDietaryPreference(e.target.value)}
            />
            Gluten-Free
          </label>
          <label>
            <input
              type="radio"
              value="No Restrictions"
              checked={dietaryPreference === 'No Restrictions'}
              onChange={(e) => setDietaryPreference(e.target.value)}
            />
            No Restrictions
          </label>
        </div>
      </div>

      {/* Religious Affiliation */}
      <div className="form-group">
        <label>Religious or Cultural Affiliation:</label>
        <input
          type="text"
          value={religiousAffiliation}
          onChange={(e) => setReligiousAffiliation(e.target.value)}
          placeholder="Enter your religious or cultural group"
        />
      </div>

      {/* Favorite Cuisine */}
      <div className="form-group">
        <label>Favorite Cuisine:</label>
        <input
          type="text"
          value={favoriteCuisine}
          onChange={(e) => setFavoriteCuisine(e.target.value)}
          placeholder="Enter your favorite foods or cuisines"
        />
      </div>

      {/* Sleep Preferences */}
      <div className="form-group">
        <label>Sleep Preferences:</label>
        <select
          value={sleepPreference}
          onChange={(e) => setSleepPreference(e.target.value)}
        >
          <option value="">Select your sleep preference</option>
          <option value="Morning Person">Morning Person</option>
          <option value="Night Owl">Night Owl</option>
          <option value="Biphasic Sleeper">Biphasic Sleeper (Split Sleep)</option>
          <option value="Polyphasic Sleeper">Polyphasic Sleeper (Multiple Short Sleeps)</option>
          <option value="Flexible">Flexible Sleep Schedule</option>
          <option value="Insomniac">Insomniac</option>
          <option value="Light Sleeper">Light Sleeper</option>
          <option value="Heavy Sleeper">Heavy Sleeper</option>
        </select>
      </div>

      {/* Pet Preference */}
      <div className="form-group">
        <label>Pet Preference:</label>
        <select
          value={petPreference}
          onChange={(e) => setPetPreference(e.target.value)}
        >
          <option value="">Do you own a pet?</option>
          <option value="No Pets">No Pets</option>
          <option value="Cat">Cat</option>
          <option value="Dog">Dog</option>
          <option value="Bird">Bird</option>
          <option value="Reptile">Reptile</option>
          <option value="Fish">Fish</option>
          <option value="Exotic Animal">Exotic Animal</option>
          <option value="Multiple Pets">Multiple Pets</option>
          <option value="Animal Lover (No Pets)">Animal Lover (No Pets)</option>
        </select>
      </div>

      {/* Environmental Practices */}
      <div className="form-group">
        <label>Environmental Practices:</label>
        <select
          value={environmentalPractices}
          onChange={(e) => setEnvironmentalPractices(e.target.value)}
        >
          <option value="">Select your environmental practice</option>
          <option value="Conscious about recycling">Conscious about recycling</option>
          <option value="Minimalist (Less waste)">Minimalist (Less waste)</option>
          <option value="Plastic-free lifestyle">Plastic-free lifestyle</option>
          <option value="Energy-efficient lifestyle">Energy-efficient lifestyle</option>
          <option value="Environmental Advocate">Environmental Advocate</option>
          <option value="Vegan (Environmental reasons)">Vegan (Environmental reasons)</option>
          <option value="Compost user">Compost user</option>
          <option value="Sustainable Fashion Enthusiast">Sustainable Fashion Enthusiast</option>
          <option value="General Environmental Awareness">General Environmental Awareness</option>
        </select>
      </div>

      <div className="button-group">
        <button type="submit" className="sign-in-btn" disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit'}
        </button>
      </div>

      {/* Response Message */}
      {responseMessage && <p className="response-message">{responseMessage}</p>}
    </form>
  );
};

export default PreferencesAndLifestyleForm;
