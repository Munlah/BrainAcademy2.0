class Course {
  constructor(id, topic, description, video, category, pic) {
    this.id = id;
    this.topic = topic;
    this.description = description;
    this.video = video;
    this.category = category;
    this.pic = pic;
  }
}

module.exports = { Course };
