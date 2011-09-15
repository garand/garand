---
layout: post
shortname: index
---

{% for post in site.posts limit: 1 %}
  <article>
    # {{ post.title }}
    {{ post.content }}
  </article>
{% endfor %}