<template>
  <div class="item">
    <div class="info__wrap">
      <div class="item__pic" :class="{
        'pic--default': isJobBoard ?
          !jobBoard.companyLogo :
          !post.userProfileUrl
      }">
        <img v-if="isJobBoard ? jobBoard.companyLogo : post.userProfileUrl"
          :src="isJobBoard ? jobBoard.companyLogo : post.userProfileUrl" alt=""
          @click="isJobBoard ? null : onUserProfileDetail" />
      </div>
      <div class="item__fnc">
        <div class="list__item">
          <button type="button" class="list__item_button ctg">
            <!-- 일반 게시글 -->
            <em v-if="!isJobBoard">{{ t('countries.' + post.country) }}</em>
            <strong v-if="!isJobBoard">{{ t('postCategories.' + post.category) }}</strong>
            <strong class="em" v-if="isJobBoard">{{ jobBoard.company }}</strong>
            <!-- 구인구직 -->
            <em v-if="isJobBoard">{{ t('countries.' + jobBoard.country) }}</em>
            <em v-if="isJobBoard">{{ jobBoard.region }}</em>
            <span v-if="!isJobBoard && post.isPublic === 'N'" class="list__private">
              <i class="blind">내국가에만 공개 된 글</i>
            </span>
          </button>
        </div>
        <!-- 일반 게시물 -->
        <div class="list__item" v-if="!isJobBoard">
          <button type="button" class="list__item_button user" @click="onUserProfileDetail">
            <em>{{ post.region }}</em>
            <strong>{{ post.userNickName }}</strong>
          </button>
        </div>
      </div>
    </div>
    <div class="text__wrap">
      <button type="button" :class="{
        list__item_button: !detail,
        list__item: detail
      }
        " @click="onBoardDetail">
        <div class="text__item">
          <p class="title">{{ isJobBoard ? jobBoard.title : post.title }}</p>
          <p class="text">{{ isJobBoard ? jobBoard.content : post.content }}</p>
        </div>
        <!-- 이미지 목록인 경우 -->
        <div class="thumb" v-if="!isJobBoard && post.attachments.length > 0">
          <img :src="thumbnail" alt="" />
        </div>
      </button>
    </div>
    <!-- 구인구직 -->
    <div class="text__wrap" v-if="isJobBoard">
      <button type="button" :class="{ 'list__item_button': !detail, 'list__item': detail }"
        @click="onBoardDetail"><!-- //목록인 경우 -->
        <!-- <div class="list__item"> //상세화면인 경우 -->
        <div class="text__item">
          <!-- 구인구직 .tag__wrap 위치 변경 -->
          <div class="tag__wrap">
            <div class="tag__inner">
              <!-- 필수 -->
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
              <!-- 선택 -->
              <!-- <div class="tag__item">
						<span class="item--tag">
							<em>대기업</em>
						</span>
						<span class="item--tag">
							<em>재택근무</em>
						</span>
					</div> -->
            </div>
          </div>
          <div class="tag__wrap">
            <div class="tag__inner">
              <div class="tag__item">
                <span class="item--hash" v-for="(tag, index) in jobBoard.tags" :key="index">
                  <em>{{ tag }}</em>
                </span>
              </div>
            </div>
          </div>
        </div>
        <!-- </div> -->
      </button>
    </div>

    <div class="attachments__wrap" v-if="isJobBoard && detail">
      <div class="attachments__item">
        <div class="item__display">
          <img src="https://komeet.s3.ap-northeast-2.amazonaws.com/content/77a6db1c302640fa.jpeg" alt="preview">
        </div>
      </div><!-- //loop -->
    </div>
    <!---->
    <div class="util__wrap">
      <div class="item__fnc">
        <p class="list__item read">
          <i class="blind">조회수</i>
          <span class="item__count">{{ isJobBoard ? jobBoard.viewCount : post.viewCount }}</span>
        </p>
        <button type="button" class="list__item_button like" :class="{ active: isLiked }" @click="likePost">
          <!-- //활성화 .active -->
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
          <!-- //활성화 .active -->
          <i class="blind">북마크</i>
        </button>
      </div>
    </div>
  </div>
  <!-- //.item -->
  <AdContent v-if="showAd" />
  <UserProfileDetail :userProfile="postAuthorInfo" @close="offUserProfileDetail" v-if="isUserProfileDetailOn" />
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { computed, ref } from 'vue'
import { useUserInfoStore } from '@/stores/userInfo'
import { timeCalculation } from '@/utils/date-time.ts'
import { likeApi, viewApi, postBookmarkdApi } from '@/services/post.ts'
import AdContent from '@/components/board/AdContent.vue'
import UserProfileDetail from '@/components/board/UserProfileDetail.vue'
import { useI18n } from 'vue-i18n'
import { IJobPost, IOtherUserInfo, type IComment, type IPost } from '@/types/interface'

const { t } = useI18n()

const userInfo = useUserInfoStore()
const router = useRouter()

// modal open/close 시 body 컨트롤
const modalOpenClass = () => {
  document.body.classList.add('inactive')
}
const modalCloseClass = () => {
  document.body.classList.remove('inactive')
}
// 프로필 보기
const isUserProfileDetailOn = ref(false)
const onUserProfileDetail = () => {
  isUserProfileDetailOn.value = true
  modalOpenClass()
}
const offUserProfileDetail = () => {
  isUserProfileDetailOn.value = false
  modalCloseClass()
}

const props = defineProps({
  post: {
    type: Object as () => IPost,
    required: true
  },
  showAd: {
    type: Boolean,
    default: false
  },
  detail: {
    type: Boolean,
    required: true,
    default: true
  },
  isJobBoard: {
    type: Boolean,
    required: true,
    default: false
  },
  jobBoard: {
    type: Object as () => IJobPost,
    required: true,
  }
})
const jobBoardFlag = ref(props.isJobBoard)
const likes = ref(jobBoardFlag ? props.jobBoard.likeCount : props.post.likeCount)
const likeUsers = ref(jobBoardFlag ? props.jobBoard.likeUsers : props.post.likeUsers)
const bookmarkUsers = ref(jobBoardFlag ? props.jobBoard.bookmarkUsers : props.post.bookmarkUsers)
const userSeq = ref(userInfo.userSeq)
const thumbnail = ref(!props.isJobBoard && props.post.attachments.length > 0 ? props.post.attachments[0] : '')
const isLiked = computed(() => {
  return likeUsers.value.includes(userSeq.value ? userSeq.value : 0)
})

const isBookmarked = computed(() => {
  return bookmarkUsers.value.includes(userSeq.value ? userSeq.value : 0)
})

const onBoardDetail = () => {
  viewApi(jobBoardFlag ? props.jobBoard.seq : props.post.seq)
  router.push(jobBoardFlag ? `/job-board/${props.jobBoard.seq}` : `/board/${props.post.seq}`)
}

// 좋아요 API 호출
const likePost = () => {
  checkIfTokenExists()
  changeLike()
  likeApi(
    jobBoardFlag ? 'job-boards' : 'posts',
    jobBoardFlag ? props.jobBoard.seq : props.post.seq
  )
}

const changeLike = () => {
  if (isLiked.value) {
    const index = likeUsers.value.indexOf(userSeq.value ? userSeq.value : 0)
    if (index !== -1) {
      likeUsers.value.splice(index, 1)
    }
    likes.value--
  } else {
    if (userSeq.value !== null) {
      likeUsers.value.push(userSeq.value)
    }
    likes.value++
  }
}

const bookmarkApi = async () => {
  checkIfTokenExists()
  changeBookmark()
  try {
    postBookmarkdApi(jobBoardFlag ? props.jobBoard.seq : props.post.seq)
  } catch (error) {
    console.log(error)
  }
}

const changeBookmark = () => {
  if (isBookmarked.value) {
    const index =
      jobBoardFlag ?
        userSeq.value !== null ? bookmarkUsers.value.indexOf(userSeq.value) : -1 :
        bookmarkUsers.value.indexOf(userSeq.value ? userSeq.value : 0)
    if (index !== -1) {
      bookmarkUsers.value.splice(index, 1)
    }
  } else {
    if (userSeq.value !== null) {
      bookmarkUsers.value.push(userSeq.value)
    }
  }
}

const allCommentCounts = (post: IPost) => {
  let result = post.comments.length
  post.comments.forEach((comment: IComment) => {
    result += comment.replies.length
  })
  return result
}

const checkIfTokenExists = () => {
  if (!userInfo.accessToken) {
    router.push('/sign-in')
  }
}

const postAuthorInfo = ref<IOtherUserInfo>({
  userSeq: props.post.userSeq,
  userProfileUrl: props.post.userProfileUrl,
  userNickName: props.post.userNickName,
  country: props.post.country,
  region: props.post.region
})

const calculateDeadLine = (deadline: string | number | Date) => {
  const date = new Date(deadline);
  const now = new Date();
  const diff: number = date.getTime() - now.getTime();
  const day = 1000 * 60 * 60 * 24;
  const days = Math.floor(diff / day);
  return 'D-' + days;
};
</script>
