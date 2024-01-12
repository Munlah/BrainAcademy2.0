class Course {
  constructor(id, topic, description, video, category) {
    this.id = id;
    this.topic = topic;
    this.description = description;
    this.video = video;
    this.category = category;
  }
}

module.exports = { Course };
