class Course {
  constructor(id, topic, description, video, category) {
    this.id = id;
    this.topic = topic;
    this.description = description;
    this.video = video;
    this.category = category;
  }

  // Convert the Course instance to a plain JavaScript object
  toJSON() {
    return {
      id: this.id,
      topic: this.topic,
      description: this.description,
      video: this.video,
      category: this.category,
    };
  }
}

module.exports = { Course };
