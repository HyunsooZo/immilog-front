<template>
  <div class="item">
    <div class="info__wrap">
      <button type="button" class="item__image" :class="{
        'image--default': isJobBoard ? !jobPost.companyLogo : !post.userProfileUrl,
        'image--default _company': isJobBoard && !jobPost.companyLogo
      }" @click="onUserProfileDetail">
        <img v-if="isJobBoard ? jobPost.companyLogo : post.userProfileUrl"
          :src="isJobBoard ? jobPost.companyLogo : post.userProfileUrl" alt=""
          @click="isJobBoard ? null : onUserProfileDetail" />
      </button>
      <div class="item__fnc" @click="onUserProfileDetail">
        <div class="list__item">
          <button type="button" class="list__item_button ctg">
            <em v-if="!isJobBoard">{{ t('countries.' + post.country) }}</em>
            <strong v-if="!isJobBoard">{{ t('postCategories.' + post.category) }}</strong>
            <strong class="em" v-if="isJobBoard">{{ jobPost.company }}</strong>
            <em v-if="isJobBoard">{{ t('countries.' + jobPost.country) }}</em>
            <em v-if="isJobBoard">{{ jobPost.region }}</em>
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
      <div class="item__fnc" v-if="detail && post.userSeq == userInfo.userSeq" @click="onMoreModal">
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
          <p class="title">{{ isJobBoard ? jobPost.title : post.title }}</p>
          <p class="text">{{ isJobBoard ? jobPost.content : post.content }}</p>
          <div class="tag__wrap" v-if="isJobBoard">
            <div class="tag__inner">
              <div class="tag__item">
                <span class="item--tag">
                  <em class="em">상시채용</em>
                </span>
                <span class="item--tag">
                  <em class="em">{{ calculateDeadLine(jobPost.deadline) }}</em>
                </span>
                <span class="item--tag">
                  <em>경력(0년 이상)</em>
                </span>
                <span class="item--tag">
                  <em>{{ jobPost.experience }}</em>
                </span>
              </div>
            </div>
          </div>
          <div class="tag__wrap" :class="detail ? '_detail' : ''" v-if="(isJobBoard ? jobPost : post).tags.length > 0">
            <div class="tag__inner">
              <div class="tag__item">
                <component v-for="( tag, index ) in isJobBoard ? jobPost.tags : post.tags " :key="index"
                  class="item--hash" :is="detail ? 'button' : 'span'" @click="">
                  <em>{{ tag }}</em>
                </component>
              </div>
            </div>
          </div>
          <div class="attachments__wrap"
            v-if="detail && (isJobBoard ? jobPost.attachments.length > 0 : post.attachments.length > 0)">
            <div class="attachments__item">
              <div class="item__display">
                <div v-for="(attachment, index) in post.attachments" :key="index">
                  <img :src="attachment" alt="preview">
                </div>
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
          <span class="item__count">{{ isJobBoard ? jobPost.viewCount : post.viewCount }}</span>
        </p>
        <button type="button" class="list__item_button like" :class="{ active: isLiked }" @click="likePost">
          <i class="blind">좋아요</i>
          <span class="item__count"> {{ isJobBoard ? jobPost.likeCount : likes }}</span>
        </button>
        <p class="list__item cmt" v-if="!isJobBoard">
          <i class="blind">댓글</i>
          <span class="item__count">{{ post.commentCount }}</span>
        </p>
      </div>
      <div class="item__fnc">
        <p class="list__item past">
          <i class="blind">작성시간</i>
          <span class="item__count">
            {{ timeCalculation(isJobBoard ? jobPost.createdAt.toString() : post.createdAt).time }}
            {{ t(timeCalculation(isJobBoard ? jobPost.createdAt.toString() : post.createdAt).text) }}
          </span>
        </p>
        <button type="button" class="list__item_button mark" :class="{ active: isBookmarked }" @click="postBookmarkApi">
          <i class="blind">북마크</i>
        </button>
      </div>
    </div>
  </div>
  <AdContent v-if="adValue" />
  <UserProfileDetail :userProfile="postAuthorInfo" @close="offUserProfileDetail" v-if="userProfileDetailValue" />
  <MoreModalForPost v-if="moreModalValue" :posetSeq="post.seq" @close="closeMoreModal" @edit="editPost"
    @delete="deletePost" />
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { computed, ref } from 'vue';
import { useUserInfoStore } from '@/stores/userInfo';
import { timeCalculation } from '@/utils/date-time.ts';
import { likeApi, viewApi, postBookmark } from '@/services/post.ts';
import { useI18n } from 'vue-i18n';
import { IJobPost, IOtherUserInfo, type IComment, type IPost } from '@/types/interface';
import { AxiosResponse } from 'axios';
import { applicationJsonWithToken } from '@/utils/header';
import UserProfileDetail from '@/components/board/UserProfileDetail.vue';
import AdContent from '@/components/board/AdContent.vue';
import MoreModalForPost from '../modal/MoreModalForPost.vue';
import api from '@/api';

const { t } = useI18n();
const router = useRouter();
const userInfo = useUserInfoStore();

const isModalOpen = () => document.body.classList.add('inactive');
const isModalClose = () => document.body.classList.remove('inactive');

const userProfileDetailValue = ref(false);

const onUserProfileDetail = () => {
  if (!postAuthorInfo.value.userSeq) setPostAuthorInfo();
  userProfileDetailValue.value = true;
  isModalOpen();
};
const offUserProfileDetail = () => {
  userProfileDetailValue.value = false;
  isModalClose();
};

const props = defineProps({
  post: {
    type: Object as () => IPost,
    required: true,
  },
  adValue: {
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
  jobPost: {
    type: Object as () => IJobPost,
    required: true,
  },
});

const jobPostValue = ref(props.isJobBoard);
const likes = ref(jobPostValue.value ? props.jobPost.likeCount : props.post.likeCount);
const likeUsers = ref(jobPostValue.value ? props.jobPost.likeUsers : props.post.likeUsers);
const bookmarkUsers = ref(jobPostValue.value ? props.jobPost.bookmarkUsers : props.post.bookmarkUsers);
const userSeq = ref(userInfo.userSeq);
const thumbnail = ref(!props.isJobBoard && props.post.attachments.length > 0 ? props.post.attachments[0] : '');

const isLiked = computed(() => likeUsers.value.includes(userSeq.value ? userSeq.value : 0));
const isBookmarked = computed(() => bookmarkUsers.value.includes(userSeq.value ? userSeq.value : 0));

const onBoardDetail = () => {
  viewApi(jobPostValue.value ? props.jobPost.seq : props.post.seq, jobPostValue.value);
  router.push(jobPostValue.value ? `/job-board/${props.jobPost.seq}` : `/board/${props.post.seq}`);
};

const likePost = () => {
  checkIfTokenExists();
  changeLike();
  likeApi(
    jobPostValue.value ? 'job-boards' : 'posts',
    jobPostValue.value ? props.jobPost.seq : props.post.seq
  );
};

// 좋아요 아이콘 상태 변경
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

// 북마크 API
const postBookmarkApi = async () => {
  checkIfTokenExists();
  changeBookmark();
  try {
    await postBookmark(jobPostValue.value ? props.jobPost.seq : props.post.seq);
  } catch (error) {
    console.error(error);
  }
};

// 북마크 변경
const changeBookmark = () => {
  if (isBookmarked.value) {
    const index = bookmarkUsers.value.indexOf(userSeq.value ? userSeq.value : 0);
    if (index !== -1) bookmarkUsers.value.splice(index, 1);
  } else {
    if (userSeq.value !== null) bookmarkUsers.value.push(userSeq.value);
  }
};

// 댓글 수 계산
const allCommentCounts = (post: IPost) => {
  let result = post.comments.length;
  post.comments.forEach((comment: IComment) => {
    result += comment.replies.length;
  });
  return result;
};

// 토큰 존재여부 체크
const checkIfTokenExists = () => {
  if (!userInfo.accessToken) router.push('/sign-in');
};


// <-- 게시물 작성자 정보
const postAuthorInfo = ref<IOtherUserInfo>({
  userSeq: props.post.userSeq,
  userProfileUrl: props.post.userProfileUrl,
  userNickName: props.post.userNickName,
  country: props.post.country,
  region: props.post.region,
});
// -->

// <-- 게시물 작성자 정보 세팅
const setPostAuthorInfo = () => {
  postAuthorInfo.value = {
    userSeq: props.post.userSeq,
    userProfileUrl: props.post.userProfileUrl,
    userNickName: props.post.userNickName,
    country: props.post.country,
    region: props.post.region,
  };
};
// -->

// <-- 구인구직 마감일
const calculateDeadLine = (deadline: string | number | Date) => {
  const date = new Date(deadline);
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const day = 1000 * 60 * 60 * 24;
  const days = Math.floor(diff / day);
  return 'D-' + days;
};
// -->        

// <-- 더보기 모달 관련
const moreModalValue = ref(false);

const onMoreModal = () => {
  moreModalValue.value = true;
};

const closeMoreModal = () => {
  moreModalValue.value = false;
};
// -->

// <-- 게시물 수정/삭제 관련
const editPost = () => { }

const deletePost = async () => {
  if (!props.isJobBoard) {
    try {
      const response: AxiosResponse<void> = await api.patch(
        `/posts/${props.post.seq}/delete`,
        {},
        applicationJsonWithToken(userInfo.accessToken)
      )
      if (response.status === 204) {
        router.push('/')
      }
    } catch (error) {
      console.log(error)
    }
  } else {
    try {
      const response: AxiosResponse<void> = await api.patch(
        `/job-boards/${props.jobPost.seq}/delete`,
        {},
        applicationJsonWithToken(userInfo.accessToken)
      )
      if (response.status === 204) {
        router.push('/')
      }
    } catch (error) {
      console.log(error)
    }
  }
}
// -->
</script>