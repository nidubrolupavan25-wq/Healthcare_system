import React from "react";
import doctorappointment from "../../assets/images/doctorappointment.avif"
import Red_Bold from "../../assets/images/Red Bold Finance YouTube Thumbnail.png"
import Blue_Teal from "../../assets/images/Blue Teal and White Illustrated Healthcare Consultation Presentation.png"
import Green_Professional from "../../assets/images/Green Professional Healthcare YouTube Thumbnail.png"
import "../../components/style/video.css";
const videos = [
  { img: doctorappointment, link: "#" },
  { img: Red_Bold, link: "#" },
  { img: Blue_Teal, link: "#" },
  { img: Green_Professional, link: "#" },
];

function VideosSection() {
  return (
    <section className="videos-section">
      <div className="videos-header">
        <h2>Our Videos</h2>
        <a href="#" className="view-more">View More</a>
      </div>

      <div className="videos-container">
        {videos.map((v, i) => (
          <div className="video-card" key={i}>
            <a href={v.link} target="_blank" rel="noreferrer">
              <div className="video-thumbnail">
                <img src={v.img} alt="Video" />
                <span className="play-button">▶</span>
              </div>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

export default VideosSection;
