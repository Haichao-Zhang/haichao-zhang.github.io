---
title: Can Robots Tell If They’re Making Progress?
slug: progress-estimation
date: 2026-04-26
summary: Progress Estimation of Task Execution
---

## Motivation

One of the recurring challenges in robot learning—especially for long-horizon tasks—is:

> How do we tell if things are going well?

Humans can often tell whether a task is progressing just by watching a video:

- a block getting closer to a target
- a drawer gradually opening
- a grasp becoming more stable

This suggests an important opportunity:

> We can learn the notion of progress from massive action-free video data.

This includes:

- human demonstrations
- cross-embodiment data
- unlabeled or weakly labeled datasets

Unlike traditional RL signals, this kind of supervision is:

- abundant
- cheap
- diverse

---

## Challenges

### 1. Progress is Relative

The notion of progress is fundamentally relative, not absolute.

A single frame is often ambiguous:

- Is the object close enough?
- Is the grasp stable or about to fail?

Without context, it is hard to tell.

Instead, progress depends on:

- where we started
- what the goal is
- how the current state compares to earlier states

This naturally suggests a pairwise or delta-based formulation.

---

### 2. Non-Monotonicity

Even in successful trajectories:

- progress is not strictly increasing
- temporary regressions are common

For example:

- repositioning before grasping
- slight slips during manipulation

This makes naïve regression unstable.

---

### 3. Cross-Embodiment Generalization

Progress should ideally be:

- invariant to robot morphology
- transferable across embodiments

This requires the model to focus on task-relevant state changes, not low-level details.

---

## Approach

We model progress as a function:

$$
p(s_t, s_0) \in [0, 1]
$$

where:

- $s_0$: initial state
- $s_t$: current state

### Architecture

We use a pretrained vision-language model such as PaliGemma as the backbone.

Given input images, we extract features:

- $f_0$: feature of initial frame
- $f_t$: feature of current frame

We then construct a delta-aware representation:

$$
f = [f_0,\; f_t,\; f_t - f_0]
$$

This explicitly encodes:

- absolute state
- reference
- change


A small head is trained to predict:

$$
p \in [0, 1],
$$

representing normalized task progress.


I used a distributional loss by discretizing the normalized progress into $K$ bins, and the value head output $K$-dimensional logits.




---

## Results

Here we show some example trajectories from the Bridge dataset.

<div class="video-grid">
  <video controls muted playsinline preload="metadata">
    <source src="/assets/posts/progress_estimation/episode_0000_video.mp4" type="video/mp4">
  </video>
  <video controls muted playsinline preload="metadata">
    <source src="/assets/posts/progress_estimation/episode_0001_video.mp4" type="video/mp4">
  </video>
  <video controls muted playsinline preload="metadata">
    <source src="/assets/posts/progress_estimation/episode_0002_video.mp4" type="video/mp4">
  </video>
  <video controls muted playsinline preload="metadata">
    <source src="/assets/posts/progress_estimation/episode_0003_video.mp4" type="video/mp4">
  </video>
</div>

---

## Looking Forward

Progress estimation opens up several promising directions:

- policy improvement
- structured exploration
- cross-domain learning

---

## Closing Thought

This work started from a simple question:

> Can we tell if the robot is making progress?


The answer does not need to be perfect.

Even a **noisy, learned notion of progress** can serve as a powerful signal—  
bridging the gap between perception and action in long-horizon robot learning. 
We will explore this further in future posts.
