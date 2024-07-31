<template>
  <div class="item">
    <div class="info__wrap">
      <button type="button" class="item__image" :class="{
        'image--default': isJobBoard ? !jobBoard.companyLogo : !post.userProfileUrl,
        'image--default _company': isJobBoard && !jobBoard.companyLogo
      }" @click="onUserProfileDetail">
        <img v-if="isJobBoard ? jobBoard.companyLogo : post.userProfileUrl"
          :src="isJobBoard ? jobBoard.companyLogo : post.userProfileUrl" alt=""
          @click="isJobBoard ? null : onUserProfileDetail" />
      </button>
      <div class="item__fnc" @click="onUserProfileDetail">
        <div class="list__item">
          <button type="button" class="list__item_button ctg">
            <em v-if="!isJobBoard">{{ t('countries.' + post.country) }}</em>
            <strong v-if="!isJobBoard">{{ t('postCategories.' + post.category) }}</strong>
            <strong class="em" v-if="isJobBoard">{{ jobBoard.company }}</strong>
            <em v-if="isJobBoard">{{ t('countries.' + jobBoard.country) }}</em>
            <em v-if="isJobBoard">{{ jobBoard.region }}</em>
            <span v-if="!isJobBoard && post.isPublic === 'N'" class="list__private">
              <i class="blind">내국가에만 공개 된 글</i>
            </span>
          </button>
        </div>
        <div class="list__item" v-if="!isJobBoard">
          <button type="button" class="list__item_button user">
            <em>{{ post.region }}</em>
            <strong>{{ post.userNickName }}</strong>
          </button>
        </div>
      </div>
      <div class="item__fnc" v-if="detail" @click="">
        <div class=" list__item">
          <button type="button" class="list__item_button more">
            <i class="blind">더보기</i>
          </button>
        </div>
      </div>
    </div>
    <div class="text__wrap">
      <component :is="detail ? 'div' : 'button'" :class="detail ? 'list__item' : 'list__item_button'"
        @click="onBoardDetail">
        <div class="text__item">
          <p class="title">{{ isJobBoard ? jobBoard.title : post.title }}</p>
          <p class="text">{{ isJobBoard ? jobBoard.content : post.content }}</p>
          <div class="tag__wrap" v-if="isJobBoard">
            <div class="tag__inner">
              <div class="tag__item">
                <span class="item--tag">
                  <em class="em">상시채용</em>
                </span>
                <span class="item--tag">
                  <em class="em">{{ calculateDeadLine(jobBoard.deadline) }}</em>
                </span>
                <span class="item--tag">
                  <em>경력(0년 이상)</em>
                </span>
                <span class="item--tag">
                  <em>{{ jobBoard.experience }}</em>
                </span>
              </div>
            </div>
          </div>
          <div class="tag__wrap" :class="detail ? '_detail' : ''" v-if="(isJobBoard ? jobBoard : post).tags.length > 0">
            <div class="tag__inner">
              <div class="tag__item">
                <component v-for="( tag, index ) in  isJobBoard ? jobBoard.tags : post.tags " :key="index"
                  class="item--hash" :is="detail ? 'button' : 'span'" @click="">
                  <em>{{ tag }}</em>
                </component>
              </div>
            </div>
          </div>
          <div class="attachments__wrap"
            v-if="detail && (isJobBoard ? jobBoard.attachments.length > 0 : post.attachments.length > 0)">
            <div class="attachments__item">
              <div class="item__display">
                <!-- <img :src="thumbnail" alt="" /> -->
                <img src="https://komeet.s3.ap-northeast-2.amazonaws.com/content/77a6db1c302640fa.jpeg" alt="preview">
              </div>
            </div>
          </div>
        </div>
        <div class="thumb" v-if="!isJobBoard && !detail && post.attachments.length > 0">
          <img :src="thumbnail" alt="" />
        </div>
      </component>
    </div>
    <div class="util__wrap">
      <div class="item__fnc">
        <p class="list__item read">
          <i class="blind">조회수</i>
          <span class="item__count">{{ isJobBoard ? jobBoard.viewCount : post.viewCount }}</span>
        </p>
        <button type="button" class="list__item_button like" :class="{ active: isLiked }" @click="likePost">
          <i class="blind">좋아요</i>
          <span class="item__count"> {{ isJobBoard ? jobBoard.likeCount : likes }}</span>
        </button>
        <p class="list__item cmt" v-if="!isJobBoard">
          <i class="blind">댓글</i>
          <span class="item__count">{{ allCommentCounts(post) }}</span>
        </p>
      </div>
      <div class="item__fnc">
        <p class="list__item past">
          <i class="blind">작성시간</i>
          <span class="item__count">
            {{ timeCalculation(isJobBoard ? jobBoard.createdAt.toString() : post.createdAt).time }}
            {{ t(timeCalculation(isJobBoard ? jobBoard.createdAt.toString() : post.createdAt).text) }}
          </span>
        </p>
        <button type="button" class="list__item_button mark" :class="{ active: isBookmarked }" @click="bookmarkApi">
          <i class="blind">북마크</i>
        </button>
      </div>
    </div>
  </div>
  <AdContent v-if="showAd" />
  <UserProfileDetail :userProfile="postAuthorInfo" @close="offUserProfileDetail" v-if="isUserProfileDetailOn" />
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { computed, ref } from 'vue';
import { useUserInfoStore } from '@/stores/userInfo';
import { timeCalculation } from '@/utils/date-time.ts';
import { likeApi, viewApi, postBookmarkdApi } from '@/services/post.ts';
import { useI18n } from 'vue-i18n';
import { IJobPost, IOtherUserInfo, type IComment, type IPost } from '@/types/interface';
import UserProfileDetail from '@/components/board/UserProfileDetail.vue';
import AdContent from '@/components/board/AdContent.vue';

const { t } = useI18n();
const router = useRouter();
const userInfo = useUserInfoStore();

const isModalOpen = () => document.body.classList.add('inactive');
const isModalClose = () => document.body.classList.remove('inactive');

const isUserProfileDetailOn = ref(false);
const onUserProfileDetail = () => {
  if (!postAuthorInfo.value.userSeq) setPostAuthorInfo();
  isUserProfileDetailOn.value = true;
  isModalOpen();
};
const offUserProfileDetail = () => {
  isUserProfileDetailOn.value = false;
  isModalClose();
};

const props = defineProps({
  post: {
    type: Object as () => IPost,
    required: true,
  },
  showAd: {
    type: Boolean,
    default: false,
  },
  detail: {
    type: Boolean,
    required: true,
    default: true,
  },
  isJobBoard: {
    type: Boolean,
    required: true,
    default: false,
  },
  jobBoard: {
    type: Object as () => IJobPost,
    required: true,
  },
});

const jobBoardFlag = ref(props.isJobBoard);
const likes = ref(jobBoardFlag.value ? props.jobBoard.likeCount : props.post.likeCount);
const likeUsers = ref(jobBoardFlag.value ? props.jobBoard.likeUsers : props.post.likeUsers);
const bookmarkUsers = ref(jobBoardFlag.value ? props.jobBoard.bookmarkUsers : props.post.bookmarkUsers);
const userSeq = ref(userInfo.userSeq);
const thumbnail = ref(!props.isJobBoard && props.post.attachments.length > 0 ? props.post.attachments[0] : '');

const isLiked = computed(() => likeUsers.value.includes(userSeq.value ? userSeq.value : 0));
const isBookmarked = computed(() => bookmarkUsers.value.includes(userSeq.value ? userSeq.value : 0));

const onBoardDetail = () => {
  viewApi(jobBoardFlag.value ? props.jobBoard.seq : props.post.seq, jobBoardFlag.value);
  router.push(jobBoardFlag.value ? `/job-board/${props.jobBoard.seq}` : `/board/${props.post.seq}`);
};

const likePost = () => {
  checkIfTokenExists();
  changeLike();
  likeApi(jobBoardFlag.value ? 'job-boards' : 'posts', jobBoardFlag.value ? props.jobBoard.seq : props.post.seq);
};

const changeLike = () => {
  if (isLiked.value) {
    const index = likeUsers.value.indexOf(userSeq.value ? userSeq.value : 0);
    if (index !== -1) likeUsers.value.splice(index, 1);
    likes.value--;
  } else {
    if (userSeq.value !== null) likeUsers.value.push(userSeq.value);
    likes.value++;
  }
};

const bookmarkApi = async () => {
  checkIfTokenExists();
  changeBookmark();
  try {
    await postBookmarkdApi(jobBoardFlag.value ? props.jobBoard.seq : props.post.seq);
  } catch (error) {
    console.error(error);
  }
};

const changeBookmark = () => {
  if (isBookmarked.value) {
    const index = bookmarkUsers.value.indexOf(userSeq.value ? userSeq.value : 0);
    if (index !== -1) bookmarkUsers.value.splice(index, 1);
  } else {
    if (userSeq.value !== null) bookmarkUsers.value.push(userSeq.value);
  }
};

const allCommentCounts = (post: IPost) => {
  let result = post.comments.length;
  post.comments.forEach((comment: IComment) => {
    result += comment.replies.length;
  });
  return result;
};

const checkIfTokenExists = () => {
  if (!userInfo.accessToken) router.push('/sign-in');
};

const postAuthorInfo = ref<IOtherUserInfo>({
  userSeq: props.post.userSeq,
  userProfileUrl: props.post.userProfileUrl,
  userNickName: props.post.userNickName,
  country: props.post.country,
  region: props.post.region,
});

const setPostAuthorInfo = () => {
  postAuthorInfo.value = {
    userSeq: props.post.userSeq,
    userProfileUrl: props.post.userProfileUrl,
    userNickName: props.post.userNickName,
    country: props.post.country,
    region: props.post.region,
  };
};

const calculateDeadLine = (deadline: string | number | Date) => {
  const date = new Date(deadline);
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const day = 1000 * 60 * 60 * 24;
  const days = Math.floor(diff / day);
  return 'D-' + days;
};
</script>